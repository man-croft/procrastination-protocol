# Procrastination Protocol

**The only way to win is to do absolutely nothing.**

Procrastination Protocol is a satirical DeFi game built on Stacks where you lock STX and earn rewards for NOT interacting. The longer your streak of inactivity, the higher your multiplier. But there are "temptation events" that offer big rewards IF you break your streak.

[![CI Tests](https://github.com/xqcxx/procrastination-protocol/actions/workflows/test-contracts.yml/badge.svg)](https://github.com/xqcxx/procrastination-protocol/actions)
[![Frontend Build](https://github.com/xqcxx/procrastination-protocol/actions/workflows/build-frontend.yml/badge.svg)](https://github.com/xqcxx/procrastination-protocol/actions)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Anti-Productivity Game** - Earn rewards for doing nothing (0-110% bonus)
- **Temptation Events** - Deterministic events that test your resolve
- **Leaderboard** - Rank the laziest procrastinators (top 10)
- **Achievement NFTs** - SIP-009 milestone badges for your procrastination
- **Penalty Pool** - Redistribution from quitters to patient holders
- **Streak Tracking** - Precise block-level tracking of inactivity

## Quick Start

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **Clarinet** 2.x ([installation guide](https://docs.hiro.so/clarinet))
- **Stacks wallet** (Leather or Hiro)

### Installation

```bash
# Clone repository
git clone https://github.com/xqcxx/procrastination-protocol.git
cd procrastination-protocol

# Install contract dependencies
npm install

# Install frontend dependencies
cd web
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Terminal 1: Start Clarinet devnet
clarinet integrate

# Terminal 2: Start Next.js frontend
cd web
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Running Tests

```bash
# Run contract tests
npm test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

## Documentation

- **[API Documentation](docs/API.md)** - Complete contract API reference
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[Development Guide](docs/DEVELOPMENT.md)** - Detailed development workflow
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment instructions

## Project Structure

```
procrastination-protocol/
├── contracts/           # Clarity smart contracts
│   ├── procrastination-vault.clar
│   ├── streak-tracker.clar
│   ├── temptation-generator.clar
│   ├── leaderboard.clar
│   ├── achievement-nft.clar
│   └── penalty-pool.clar
├── web/                 # Next.js frontend
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   └── hooks/          # Custom hooks
└── README.md
```

## Contracts

| Contract | Description | LOC |
|----------|-------------|-----|
| `procrastination-vault` | Core logic: lock funds, calculate bonuses, claim rewards | 129 |
| `streak-tracker` | Track inactive blocks and calculate streak duration | 52 |
| `temptation-generator` | Generate deterministic temptation events | 32 |
| `leaderboard` | Rank top 10 procrastinators (FIFO) | 44 |
| `achievement-nft` | SIP-009 milestone NFT badges | 79 |
| `penalty-pool` | Redistribute penalties from quitters | 45 |
| `nft-trait` | SIP-009 NFT trait definition | 14 |

**Total:** 395 lines of Clarity code

## How It Works

### 1. Start Procrastinating

Lock STX to begin your streak. The clock starts counting blocks.

```clarity
(contract-call? .procrastination-vault start-procrastinating u10000000) ;; Lock 10 STX
```

### 2. Do Nothing

Every block you don't interact increases your streak. Bonuses accumulate:

| Streak Duration | Bonus |
|----------------|-------|
| 1-6 days       | 0%    |
| 7-13 days      | +1%   |
| 14-29 days     | +2%   |
| 30-99 days     | +5%   |
| 100+ days      | +10%  |

**Maximum bonus: 110%**

### 3. Face Temptations

Every ~7 days (1008 blocks), a temptation event appears offering 5-15% instant reward. Taking it breaks your streak and applies 10% penalty.

```clarity
;; Resist or take temptation
(contract-call? .procrastination-vault take-temptation u1)
```

### 4. Claim Achievements

Reach milestones to claim NFT badges:

| Achievement | Streak Required | Badge |
|-------------|----------------|-------|
| "Lazy Beginner" | 1 day (144 blocks) | 🛋️ |
| "Couch Potato" | 7 days (1008 blocks) | 🥔 |
| "Professional Slacker" | 14 days (2016 blocks) | 😴 |
| "Master of Inaction" | 30 days (4320 blocks) | 🏆 |
| "Diamond Couch" | 100 days (14400 blocks) | 💎 |

### 5. Claim or Quit

**Claim with Bonus:**
```clarity
(contract-call? .procrastination-vault claim-with-bonus)
```

**Quit Early (10% penalty):**
```clarity
(contract-call? .procrastination-vault quit-early)
```

Penalties go to the penalty pool and are distributed as bonuses to patient holders.

## Technology Stack

### Blockchain
- **Platform:** Stacks (Bitcoin Layer 2)
- **Language:** Clarity 2
- **Development:** Clarinet 2.x
- **Standards:** SIP-009 (NFT), deterministic randomness

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Wallet Integration:** @stacks/connect 8.2.4

### Testing & CI/CD
- **Test Framework:** Vitest 4.0.7
- **Test Environment:** Simnet (@stacks/clarinet-sdk)
- **Coverage:** v8 provider
- **CI/CD:** GitHub Actions

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes and add tests
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Open a Pull Request

## Community

- **GitHub Issues:** Report bugs and request features
- **Discussions:** Ask questions and share ideas
- **Discord:** Join the Stacks developer community

## Security

Found a security issue? Please email security@example.com instead of opening a public issue.

## License

MIT License - see [LICENSE](LICENSE) file for details

---

Built with ❤️ on Stacks. Procrastinate responsibly! 😴
