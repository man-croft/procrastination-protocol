# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       User Interface                         │
│            (Next.js 16 Frontend - React 19)                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ @stacks/connect
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  Stacks Blockchain                           │
│                  (Bitcoin Layer 2)                           │
└──────┬──────────────────────────────────────────────────────┘
       │
       │ Contract Interactions
       │
┌──────▼──────────────────────────────────────────────────────┐
│                 Smart Contract Layer                         │
│                   (Clarity Language)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐          ┌──────────────────┐         │
│  │procrastination- │◄─────────┤ streak-tracker   │         │
│  │     vault       │          └──────────────────┘         │
│  │  (Core Logic)   │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           │ Manages                                          │
│           │                                                  │
│  ┌────────▼────────┐   ┌──────────────────┐               │
│  │  penalty-pool   │   │   temptation-    │               │
│  │ (Redistribute)  │   │    generator     │               │
│  └─────────────────┘   └──────────────────┘               │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  leaderboard     │  │ achievement-nft  │               │
│  │ (Top 10 FIFO)    │  │   (SIP-009)      │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Contract Relationships

```
procrastination-vault (Main Controller)
    ├── Calls: streak-tracker.start-streak()
    ├── Calls: temptation-generator.get-current-temptation()
    ├── Calls: penalty-pool.add-penalty()
    ├── Calls: penalty-pool.distribute-bonus()
    └── Events: Emit completion events

streak-tracker (Duration Tracking)
    └── Read by: vault, leaderboard, achievement-nft

temptation-generator (Deterministic Events)
    └── Read by: vault, frontend

leaderboard (Rankings)
    └── Reads: streak-tracker

achievement-nft (Milestones)
    └── Reads: streak-tracker

penalty-pool (Redistribution)
    └── Called by: vault
```

## Data Flow

### Start Procrastinating
```
User Input (amount)
    │
    ▼
Frontend validates input
    │
    ▼
vault.start-procrastinating(amount)
    │
    ├──▶ Check user not already active
    ├──▶ Store user data (amount, start-block)
    └──▶ Call streak-tracker.start-streak(user)
```

### Claim with Bonus
```
User action
    │
    ▼
vault.claim-with-bonus()
    │
    ├──▶ Get streak length from streak-tracker
    ├──▶ Calculate bonus (0-110%)
    ├──▶ Check penalty-pool for extra bonuses
    ├──▶ Transfer total amount to user
    └──▶ Clear user data
```

### Take Temptation
```
User accepts temptation
    │
    ▼
vault.take-temptation(id)
    │
    ├──▶ Verify temptation available
    ├──▶ Calculate temptation reward
    ├──▶ Apply 10% penalty to locked funds
    ├──▶ Transfer remainder + temptation to user
    ├──▶ Add penalty to penalty-pool
    └──▶ Clear user data
```

## Frontend Architecture

```
app/
├── page.tsx                    # Home/landing
├── start/page.tsx              # Start procrastinating
├── dashboard/page.tsx          # User dashboard
├── temptations/page.tsx        # Active temptations
├── leaderboard/page.tsx        # Top 10 rankings
└── achievements/page.tsx       # NFT badges

components/
├── Header.tsx                  # Navigation
├── WalletConnect.tsx           # Wallet integration
├── StreakDisplay.tsx           # Streak visualization
├── TemptationCard.tsx          # Temptation offers
└── AchievementBadge.tsx        # NFT display

hooks/
├── use-wallet.ts               # Wallet state
├── use-streak.ts               # Streak data
├── use-temptations.ts          # Temptation data
└── use-achievements.ts         # NFT data

lib/
├── stacks.ts                   # Network config
├── contracts.ts                # Contract interactions
└── utils.ts                    # Helper functions
```

## Technology Stack

### Blockchain
- **Platform**: Stacks (Bitcoin Layer 2)
- **Language**: Clarity 2
- **Standard**: SIP-009 (NFT trait)
- **Development**: Clarinet 2.x

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Wallet**: @stacks/connect 8.2.4

### Testing
- **Framework**: Vitest 4.0.7
- **Environment**: Simnet (@stacks/clarinet-sdk)
- **Coverage**: v8 provider

### Deployment
- **Contracts**: Clarinet deploy
- **Frontend**: Vercel/Netlify
- **Networks**: Devnet, Testnet, Mainnet

## Security Considerations

### Contract Security
1. **No Reentrancy**: Clarity prevents reentrancy by design
2. **Authorization**: tx-sender and contract-caller checks
3. **Post-Conditions**: Frontend enforces post-conditions
4. **Overflow Protection**: Native uint type prevents overflow
5. **Deterministic**: All randomness is deterministic

### Frontend Security
1. **Input Validation**: Validate before submission
2. **Post-Conditions**: Set expected token transfers
3. **Error Handling**: Graceful degradation
4. **Wallet Security**: No private key exposure

## Performance Considerations

### On-Chain
- **Gas Efficiency**: Minimal contract calls
- **Storage**: Efficient map structures
- **Computation**: Pre-calculated values when possible

### Frontend
- **SSR/SSG**: Next.js optimization
- **Code Splitting**: Route-based chunks
- **Image Optimization**: Next.js Image component
- **Caching**: SWR for data fetching

## Scalability

### Current Limits
- Max 10 leaderboard entries (FIFO)
- No pagination (all data loaded)
- Manual leaderboard updates

### Future Improvements
- Paginated leaderboard
- Automatic leaderboard updates via events
- Optimized streak calculations
- Multi-tier achievements
