# Contributing to Procrastination Protocol

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug template** when creating new issues
3. **Provide details**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (OS, browser, wallet)

### Suggesting Features

1. **Check existing feature requests**
2. **Explain the use case** clearly
3. **Describe the solution** you envision
4. **Consider alternatives** and trade-offs

### Pull Requests

#### Before You Start

1. **Open an issue** to discuss major changes
2. **Check** that someone isn't already working on it
3. **Fork the repository**
4. **Create a branch** from `master`

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### Making Changes

1. **Write tests** for new functionality
2. **Update documentation** as needed
3. **Follow code style** guidelines
4. **Keep commits atomic** and well-described
5. **Run tests** before committing

```bash
npm test
```

#### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```
feat(vault): add multi-asset support

Add support for locking multiple token types in the vault.
Implements SIP-010 token interface.

Closes #123
```

```
fix(leaderboard): correct sorting algorithm

Previous FIFO approach didn't maintain proper order.
Now uses insertion sort for accurate rankings.
```

#### Submitting PR

1. **Push to your fork**
```bash
git push origin feat/your-feature-name
```

2. **Open PR** on GitHub
3. **Fill out PR template** completely
4. **Link related issues**
5. **Request review** from maintainers

#### PR Guidelines

- ✅ Clear title and description
- ✅ Tests pass
- ✅ Documentation updated
- ✅ No merge conflicts
- ✅ Follows code style
- ✅ Atomic commits

### Review Process

1. **Maintainer review** (1-3 days typically)
2. **Address feedback** with additional commits
3. **Approval required** from at least one maintainer
4. **CI checks must pass**
5. **Merge** by maintainer

## Development Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.

Quick start:
```bash
# Clone and install
git clone https://github.com/xqcxx/procrastination-protocol.git
cd procrastination-protocol
npm install

# Run tests
npm test

# Start devnet
clarinet integrate

# Start frontend (in another terminal)
cd web && npm run dev
```

## Code Style

### Clarity Contracts

```clarity
;; Use descriptive names
(define-public (lock-funds (amount uint))
  ;; Add comments for complex logic
  (begin
    ;; Validate input
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    ;; Implementation
    (ok true)
  )
)
```

### TypeScript/React

```typescript
// Use TypeScript types
interface UserData {
  amount: bigint;
  startBlock: number;
}

// Functional components
export function Component({ data }: { data: UserData }) {
  return <div>{data.amount.toString()}</div>;
}
```

## Testing

### Contract Tests

```typescript
describe("Feature", () => {
  it("should do something", () => {
    const { result } = simnet.callPublicFn(
      "contract",
      "function",
      [Cl.uint(100)],
      wallet
    );
    expect(result).toBeOk(Cl.bool(true));
  });
});
```

### Test Coverage

Aim for:
- **Contracts**: 80%+ coverage
- **Critical paths**: 100% coverage
- **Edge cases**: Well covered
- **Error conditions**: All tested

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Fixing bugs (if not obvious)
- Improving architecture

Files to update:
- `README.md` - High-level overview
- `docs/API.md` - Contract APIs
- `docs/ARCHITECTURE.md` - System design
- `docs/DEVELOPMENT.md` - Dev workflows
- Code comments - Complex logic

## Release Process

(For maintainers)

1. **Version bump** in `package.json`
2. **Update CHANGELOG.md**
3. **Create release tag**
4. **Deploy to testnet** for testing
5. **Deploy to mainnet** after verification
6. **Publish release** on GitHub

## Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Credited in release notes
- Appreciated publicly!

## Questions?

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Discord**: For real-time chat (link in README)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for making Procrastination Protocol better! 🚀
