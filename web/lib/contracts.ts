// Contract Config
const DEPLOYER = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const CONTRACTS = {
  VAULT: {
    address: DEPLOYER,
    name: 'procrastination-vault-v2'
  },
  STREAK: {
    address: DEPLOYER,
    name: 'streak-tracker-v2'
  },
  TEMPTATION: {
    address: DEPLOYER,
    name: 'temptation-generator-v2'
  },
  LEADERBOARD: {
    address: DEPLOYER,
    name: 'leaderboard-v2'
  },
  NFT: {
    address: DEPLOYER,
    name: 'achievement-nft-v2'
  },
  POOL: {
    address: DEPLOYER,
    name: 'penalty-pool-v2'
  }
} as const;

async function getNetwork() {
  const { STACKS_MAINNET, STACKS_TESTNET } = await import('@stacks/network');
  return process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? STACKS_MAINNET
    : STACKS_TESTNET;
}

// Read Only Helpers
export async function getLockedAmount(user: string) {
  const { fetchCallReadOnlyFunction, cvToValue, standardPrincipalCV } = await import('@stacks/transactions');
  const network = await getNetwork();
  
  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: CONTRACTS.VAULT.address,
    contractName: CONTRACTS.VAULT.name,
    functionName: 'get-locked-amount',
    functionArgs: [standardPrincipalCV(user)],
    senderAddress: user
  });
  return cvToValue(result);
}

export async function getStreakDays(user: string) {
  const { fetchCallReadOnlyFunction, cvToValue, standardPrincipalCV } = await import('@stacks/transactions');
  const network = await getNetwork();

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: CONTRACTS.STREAK.address,
    contractName: CONTRACTS.STREAK.name,
    functionName: 'get-streak-days',
    functionArgs: [standardPrincipalCV(user)],
    senderAddress: user
  });
  return cvToValue(result);
}

export async function getCurrentTemptation() {
  try {
    const { fetchCallReadOnlyFunction, cvToValue } = await import('@stacks/transactions');
    const network = await getNetwork();

    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACTS.TEMPTATION.address,
      contractName: CONTRACTS.TEMPTATION.name,
      functionName: 'get-current-temptation',
      functionArgs: [],
      senderAddress: DEPLOYER
    });
    return cvToValue(result);
  } catch (e) {
    return null;
  }
}

export async function getLeaderboard() {
  const { fetchCallReadOnlyFunction, cvToValue } = await import('@stacks/transactions');
  const network = await getNetwork();

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: CONTRACTS.LEADERBOARD.address,
    contractName: CONTRACTS.LEADERBOARD.name,
    functionName: 'get-leaderboard',
    functionArgs: [],
    senderAddress: DEPLOYER
  });
  return cvToValue(result);
}

export async function hasBadge(user: string, badgeType: number) {
  const { fetchCallReadOnlyFunction, cvToValue, standardPrincipalCV, uintCV } = await import('@stacks/transactions');
  const network = await getNetwork();

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: CONTRACTS.NFT.address,
    contractName: CONTRACTS.NFT.name,
    functionName: 'has-badge',
    functionArgs: [standardPrincipalCV(user), uintCV(badgeType)],
    senderAddress: user
  });
  return cvToValue(result);
}

// Transaction Helpers (Action Generators)
export async function getStartOptions(amount: number, userAddress: string) {
  const { uintCV, PostConditionMode, Pc } = await import('@stacks/transactions');
  return {
    contractAddress: CONTRACTS.VAULT.address,
    contractName: CONTRACTS.VAULT.name,
    functionName: 'start-procrastinating',
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      Pc.principal(userAddress).willSendEq(amount).ustx()
    ]
  };
}

export async function getClaimOptions() {
  const { PostConditionMode } = await import('@stacks/transactions');
  return {
    contractAddress: CONTRACTS.VAULT.address,
    contractName: CONTRACTS.VAULT.name,
    functionName: 'claim-rewards',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow
  };
}

export async function getQuitOptions() {
  const { PostConditionMode } = await import('@stacks/transactions');
  return {
    contractAddress: CONTRACTS.VAULT.address,
    contractName: CONTRACTS.VAULT.name,
    functionName: 'quit-procrastinating',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow
  };
}

export async function getClaimTemptationOptions() {
  const { PostConditionMode } = await import('@stacks/transactions');
  return {
    contractAddress: CONTRACTS.TEMPTATION.address,
    contractName: CONTRACTS.TEMPTATION.name,
    functionName: 'claim-temptation',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow
  };
}

export async function getUpdateLeaderboardOptions() {
  const { PostConditionMode } = await import('@stacks/transactions');
  return {
    contractAddress: CONTRACTS.LEADERBOARD.address,
    contractName: CONTRACTS.LEADERBOARD.name,
    functionName: 'update-my-position',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow
  };
}

export async function getClaimBadgeOptions(badgeId: number) {
  const { uintCV, PostConditionMode } = await import('@stacks/transactions');
  return {
    contractAddress: CONTRACTS.NFT.address,
    contractName: CONTRACTS.NFT.name,
    functionName: 'claim-badge',
    functionArgs: [uintCV(badgeId)],
    postConditionMode: PostConditionMode.Allow
  };
}
