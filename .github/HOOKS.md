# Pre-commit Hook Setup

This repository includes a pre-commit hook to ensure code quality.

## Installation

The pre-commit hook is located at `.git/hooks/pre-commit` (created automatically).

To set up for contributors:

```bash
# Make the hook executable
chmod +x .git/hooks/pre-commit
```

## What the hook checks

1. **Contract Tests**: Runs all contract tests before commit
2. **unwrap-panic Detection**: Warns if unwrap-panic is used in contracts
3. **console.log Detection**: Warns if console.log is found in production code

## Bypassing the hook

In emergencies, you can bypass the hook with:

```bash
git commit --no-verify -m "your message"
```

However, this should be used sparingly as it skips important quality checks.
