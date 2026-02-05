# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **Clarinet** 2.x ([installation guide](https://docs.hiro.so/clarinet))
- **Git** for version control
- **Stacks Wallet** (Leather or Hiro) for testing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/xqcxx/procrastination-protocol.git
cd procrastination-protocol
```

2. **Install contract dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd web
npm install
cd ..
```

4. **Set up environment variables**
```bash
cp web/.env.example web/.env
# Edit web/.env with your configuration
```

## Development Workflow

### Running Tests

```bash
# Run all contract tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

### Local Development

#### Start Devnet

```bash
# Terminal 1: Start Clarinet devnet
clarinet integrate

# This starts a local Stacks node with your contracts deployed
```

#### Start Frontend

```bash
# Terminal 2: Start Next.js dev server
cd web
npm run dev

# Frontend will be available at http://localhost:3000
```

### Contract Development

#### File Structure
```
contracts/
├── procrastination-vault.clar      # Main contract
├── streak-tracker.clar              # Streak tracking
├── temptation-generator.clar        # Temptation events
├── leaderboard.clar                 # Rankings
├── achievement-nft.clar             # NFT badges
├── penalty-pool.clar                # Penalty redistribution
└── nft-trait.clar                   # SIP-009 trait
```

#### Adding a New Contract

1. Create contract file in `contracts/`
```bash
touch contracts/my-new-contract.clar
```

2. Add to `Clarinet.toml`
```toml
[contracts.my-new-contract]
path = "contracts/my-new-contract.clar"
clarity_version = 2
epoch = 2.5
```

3. Write tests
```bash
touch tests/my-new-contract.test.ts
```

4. Run tests
```bash
npm test
```

#### Testing Contracts

Example test structure:
```typescript
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("My New Contract", () => {
  it("should do something", () => {
    const { result } = simnet.callPublicFn(
      "my-new-contract",
      "my-function",
      [Cl.uint(100)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });
});
```

### Frontend Development

#### Adding a New Page

1. Create page in `web/app/`
```bash
mkdir web/app/my-page
touch web/app/my-page/page.tsx
```

2. Implement page
```typescript
export default function MyPage() {
  return (
    <div>
      <h1>My New Page</h1>
    </div>
  );
}
```

#### Adding a New Component

1. Create in `web/components/`
```bash
touch web/components/MyComponent.tsx
```

2. Implement component
```typescript
'use client';

export function MyComponent() {
  return <div>My Component</div>;
}
```

#### Contract Interaction

Example hook for contract interaction:
```typescript
import { useEffect, useState } from 'react';
import { callReadOnlyFunction } from '@stacks/transactions';

export function useMyContractData(user: string) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await callReadOnlyFunction({
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractName: 'my-contract',
        functionName: 'get-data',
        functionArgs: [principalCV(user)],
        network: getStacksNetwork(),
        senderAddress: user,
      });
      setData(cvToValue(result));
    }
    if (user) fetchData();
  }, [user]);

  return data;
}
```

## Code Style

### Clarity Contracts

- Use descriptive function names
- Add comments for complex logic
- Use constants for error codes
- Follow naming conventions:
  - Public functions: `kebab-case`
  - Private functions: `kebab-case`
  - Constants: `SCREAMING-KEBAB-CASE`

Example:
```clarity
(define-constant ERR_NOT_FOUND (err u404))

(define-public (my-public-function (param uint))
  ;; Function implementation
  (ok true)
)

(define-private (my-private-helper (data uint))
  ;; Helper implementation
  data
)
```

### TypeScript/React

- Use TypeScript strict mode
- Functional components with hooks
- Use `'use client'` for client components
- Follow naming conventions:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: SCREAMING_SNAKE_CASE

Example:
```typescript
'use client';

import { useState } from 'react';

export function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## Debugging

### Contract Debugging

Use Clarinet console:
```bash
clarinet console

# In the console:
>>> (contract-call? .procrastination-vault get-user-info tx-sender)
```

### Frontend Debugging

Use browser DevTools and console:
```typescript
console.log('User data:', userData);
```

## Deployment

### Deploy to Testnet

1. Update deployment plan
```yaml
# deployments/testnet.yaml
---
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: procrastination-vault
            # ... other contracts
```

2. Deploy
```bash
clarinet deployments apply -p deployments/testnet.yaml
```

3. Note contract addresses and update `.env`

### Deploy Frontend

```bash
cd web
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

## Best Practices

### Contracts
- ✅ Write comprehensive tests
- ✅ Use proper error handling (avoid `unwrap-panic`)
- ✅ Add authorization checks
- ✅ Document public functions
- ✅ Use constants for magic numbers

### Frontend
- ✅ Validate inputs before submission
- ✅ Add loading states
- ✅ Handle errors gracefully
- ✅ Use post-conditions
- ✅ Provide user feedback

### General
- ✅ Commit often with clear messages
- ✅ Run tests before committing
- ✅ Update documentation
- ✅ Review code before PR
- ✅ Keep dependencies updated

## Common Issues

### Tests Failing

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Frontend Not Connecting

1. Check wallet extension installed
2. Verify network settings match
3. Check contract addresses in `.env`
4. Verify wallet has testnet STX

### Contract Deployment Errors

1. Ensure sufficient STX for fees
2. Check Clarinet.toml syntax
3. Verify contract dependencies
4. Check network connectivity

## Resources

- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks.js Documentation](https://stacks.js.org)

## Getting Help

- GitHub Issues: Report bugs and request features
- Discord: Join Stacks developer community
- Documentation: Check docs/ directory
