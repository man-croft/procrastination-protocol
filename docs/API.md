# Contract API Documentation

This document provides detailed API documentation for all Procrastination Protocol smart contracts.

## Table of Contents

- [procrastination-vault](#procrastination-vault)
- [streak-tracker](#streak-tracker)
- [temptation-generator](#temptation-generator)
- [leaderboard](#leaderboard)
- [achievement-nft](#achievement-nft)
- [penalty-pool](#penalty-pool)

---

## procrastination-vault

Main contract for managing locked funds and user streaks.

### Public Functions

#### `start-procrastinating (amount uint)`

Start a new procrastination streak by locking STX.

**Parameters:**
- `amount` (uint): Amount of STX to lock (in microSTX)

**Returns:** `(response bool uint)`
- Success: `(ok true)`
- Errors:
  - `u400`: Already procrastinating
  - `u401`: Invalid amount (must be > 0)

**Example:**
```clarity
(contract-call? .procrastination-vault start-procrastinating u1000000) ;; Lock 1 STX
```

#### `claim-with-bonus ()`

Claim locked funds plus streak bonus. Must wait for full streak duration.

**Returns:** `(response bool uint)`
- Success: `(ok true)` with bonus applied
- Errors:
  - `u404`: Not procrastinating
  - `u403`: Too early to claim

**Bonus Calculation:**
- Base: 100% of locked amount
- +1% per 7 days (144 * 7 blocks)
- +10% for 100+ day streak
- Max bonus: 110%

**Example:**
```clarity
(contract-call? .procrastination-vault claim-with-bonus)
```

#### `quit-early ()`

Quit streak early and forfeit 10% penalty.

**Returns:** `(response bool uint)`
- Success: `(ok true)` returns 90% of locked funds
- Errors:
  - `u404`: Not procrastinating

**Example:**
```clarity
(contract-call? .procrastination-vault quit-early)
```

#### `take-temptation (temptation-id uint)`

Accept a temptation offer and break streak for instant reward.

**Parameters:**
- `temptation-id` (uint): ID of the temptation

**Returns:** `(response bool uint)`
- Success: `(ok true)` with temptation reward
- Errors:
  - `u404`: Not procrastinating or invalid temptation
  - `u403`: Temptation not available

**Example:**
```clarity
(contract-call? .procrastination-vault take-temptation u1)
```

### Read-Only Functions

#### `get-user-info (user principal)`

Get complete info about a user's streak.

**Returns:** `(optional { amount: uint, start-block: uint, active: bool })`

**Example:**
```clarity
(contract-call? .procrastination-vault get-user-info tx-sender)
```

#### `calculate-bonus (blocks-elapsed uint)`

Calculate bonus percentage for given duration.

**Parameters:**
- `blocks-elapsed` (uint): Number of blocks since start

**Returns:** `uint` - Bonus percentage (0-110)

---

## streak-tracker

Tracks procrastination streaks and calculates durations.

### Public Functions

#### `start-streak (user principal)`

Start tracking a new streak (called by vault contract).

**Parameters:**
- `user` (principal): User to track

**Returns:** `(response bool uint)`

**Authorization:** Can only be called by vault contract

### Read-Only Functions

#### `get-streak-length (user principal)`

Get current streak length in blocks.

**Returns:** `uint` - Blocks elapsed since start

**Example:**
```clarity
(contract-call? .streak-tracker get-streak-length tx-sender)
```

#### `get-streak-days (user principal)`

Get approximate streak length in days.

**Returns:** `uint` - Approximate days (blocks / 144)

**Example:**
```clarity
(contract-call? .streak-tracker get-streak-days tx-sender)
```

---

## temptation-generator

Generates deterministic temptation events based on block heights.

### Read-Only Functions

#### `get-current-temptation (user principal)`

Get currently available temptation for user.

**Returns:** `(optional { id: uint, reward: uint, expires-at: uint })`

**Temptation Schedule:**
- Every 1008 blocks (~7 days)
- Reward: 5-15% of locked amount
- Expires after 144 blocks (~1 day)

**Example:**
```clarity
(contract-call? .temptation-generator get-current-temptation tx-sender)
```

#### `is-temptation-available (user principal)`

Check if user has an active temptation.

**Returns:** `bool`

---

## leaderboard

Maintains top 10 procrastinators by streak length.

### Public Functions

#### `update-leaderboard (user principal)`

Submit current streak to leaderboard (manual update required).

**Returns:** `(response bool uint)`
- Success: `(ok true)` if added to top 10
- Errors:
  - `u404`: Not procrastinating
  - `u403`: Streak too short for leaderboard

**Example:**
```clarity
(contract-call? .leaderboard update-leaderboard tx-sender)
```

### Read-Only Functions

#### `get-top-10 ()`

Get list of top 10 procrastinators.

**Returns:** `(list 10 { user: principal, blocks: uint })`

**Note:** List is FIFO, not sorted. First entry = longest streak.

---

## achievement-nft

SIP-009 compliant NFT badges for milestone achievements.

### Public Functions

#### `claim-achievement (milestone uint)`

Claim achievement NFT for reaching milestone.

**Parameters:**
- `milestone` (uint): Achievement level
  - `1` - 1 day (144 blocks)
  - `7` - 7 days (1008 blocks)
  - `14` - 14 days (2016 blocks)
  - `30` - 30 days (4320 blocks)
  - `100` - 100 days (14400 blocks)

**Returns:** `(response uint uint)`
- Success: `(ok token-id)`
- Errors:
  - `u404`: Haven't reached milestone
  - `u409`: Already claimed

**Example:**
```clarity
(contract-call? .achievement-nft claim-achievement u7) ;; Claim 7-day badge
```

### Read-Only Functions (SIP-009)

#### `get-owner (token-id uint)`

Get NFT owner.

#### `get-token-uri (token-id uint)`

Get metadata URI for token.

---

## penalty-pool

Manages penalty fees from early quitters.

### Public Functions

#### `distribute-bonus (user principal amount uint)`

Distribute accumulated penalties as bonuses (called by vault).

**Authorization:** Can only be called by vault contract

### Read-Only Functions

#### `get-pool-balance ()`

Get total penalties accumulated.

**Returns:** `uint` - Total STX in penalty pool

---

## Error Codes

| Code | Meaning |
|------|---------|
| `u400` | Invalid input / Already exists |
| `u401` | Unauthorized / Not authorized |
| `u403` | Forbidden / Too early |
| `u404` | Not found |
| `u409` | Already claimed / Duplicate |

---

## Integration Example

```clarity
;; Full lifecycle example

;; 1. Start procrastinating with 10 STX
(contract-call? .procrastination-vault start-procrastinating u10000000)

;; 2. Check streak after some time
(contract-call? .streak-tracker get-streak-days tx-sender) ;; Returns days

;; 3. Check if temptation available
(contract-call? .temptation-generator get-current-temptation tx-sender)

;; 4. Resist temptation and claim milestone achievement
(contract-call? .achievement-nft claim-achievement u7)

;; 5. Update leaderboard
(contract-call? .leaderboard update-leaderboard tx-sender)

;; 6. Finally claim with bonus
(contract-call? .procrastination-vault claim-with-bonus)
```
