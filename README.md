# Procrastination Protocol

**The only way to win is to do absolutely nothing.**

Procrastination Protocol is a satirical DeFi game built on Stacks where you lock STX and earn rewards for NOT interacting. The longer your streak of inactivity, the higher your multiplier. But there are "temptation events" that offer big rewards IF you break your streak.

## Features

- **Anti-Productivity Game** - Earn rewards for doing nothing
- **Temptation Events** - Random events that test your resolve
- **Leaderboard** - Rank the laziest procrastinators
- **Achievement NFTs** - Milestone badges for your procrastination

## Getting Started

### Prerequisites

- Node.js 18+
- Clarinet (for contract development)
- A Stacks wallet (Leather recommended)

### Installation

```bash
# Install dependencies
cd web && npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your contract addresses
```

### Development

```bash
# Start the Next.js development server
cd web && npm run dev
```

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

| Contract | Description |
|----------|-------------|
| `procrastination-vault` | Lock funds to start your journey |
| `streak-tracker` | Count inactive blocks |
| `temptation-generator` | Random temptation events from block data |
| `leaderboard` | Rank the laziest users |
| `achievement-nft` | SIP-009 milestone badges |
| `penalty-pool` | Redistribute from quitters to holders |

## Achievements

| Achievement | Streak Required |
|-------------|-----------------|
| "Lazy Beginner" | 1 day |
| "Couch Potato" | 7 days |
| "Professional Slacker" | 14 days |
| "Master of Inaction" | 30 days |
| "Diamond Couch" | 100 days |

## Environment Variables

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST...
VAULT_CONTRACT=...
STREAK_TRACKER_CONTRACT=...
TEMPTATION_CONTRACT=...
LEADERBOARD_CONTRACT=...
ACHIEVEMENT_NFT_CONTRACT=...
PENALTY_POOL_CONTRACT=...
```

## Deployment

### Frontend

Deploy to Vercel:

```bash
cd web
vercel deploy
```

### Contracts

Deploy to testnet:

```bash
clarinet deploy --testnet
```

## The Game

1. **Start Procrastinating** - Lock STX to begin your streak
2. **Do Nothing** - Every block you don't interact increases your streak
3. **Watch Temptations** - Random events offer rewards for breaking your streak
4. **Claim Milestones** - NFT badges for your achievements
5. **Quit (Optional)** - 10% penalty goes to the pool for remaining holders

## Built with Clarity 4

This project uses Clarity 4 features including:
- `stacks-block-time` for time-based rewards
- Native SIP-009 and SIP-013 standards
- Bitcoin block data for deterministic events

## License

MIT
