import { network } from './stacks';
import { openContractCall } from '@stacks/connect';
import { 
  fetchCallReadOnlyFunction, 
  cvToValue, 
  standardPrincipalCV, 
  uintCV,
  noneCV,
  someCV,
  PostConditionMode,
  Pc
} from '@stacks/transactions';

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

// Read Only Helpers
export async function getLockedAmount(user: string) {
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
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACTS.TEMPTATION.address,
      contractName: CONTRACTS.TEMPTATION.name,
      functionName: 'get-current-temptation',
      functionArgs: [],
      senderAddress: DEPLOYER
    });
    return cvToValue(result); // Returns object or null (err)
  } catch (e) {
    return null;
  }
}

export async function getLeaderboard() {
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
  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: CONTRACTS.NFT.address,
    contractName: CONTRACTS.NFT.name,
    functionName: 'has-badge',
    functionArgs: [standardPrincipalCV(user), uintCV(badgeType)],
    senderAddress: user
  });
  return cvToValue(result); // Returns bool
}

// Transaction Helpers (Action Generators)
export function startProcrastinating(amount: number) {
  return {
    contractAddress: CONTRACTS.VAULT.address,
    contractName: CONTRACTS.VAULT.name,
    functionName: 'start-procrastinating',
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      Pc.principal(window.alert ? "ST..." : "ST...").willSendEq(amount).ustx() // Placeholder
    ]
  };
}

export function getStartOptions(amount: number, userAddress: string) {
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

export const CLAIM_OPTIONS = {
  contractAddress: CONTRACTS.VAULT.address,
  contractName: CONTRACTS.VAULT.name,
  functionName: 'claim-rewards',
  functionArgs: [],
  postConditionMode: PostConditionMode.Allow
};

export const QUIT_OPTIONS = {
  contractAddress: CONTRACTS.VAULT.address,
  contractName: CONTRACTS.VAULT.name,
  functionName: 'quit-procrastinating',
  functionArgs: [],
  postConditionMode: PostConditionMode.Allow
};

export const CLAIM_TEMPTATION_OPTIONS = {
  contractAddress: CONTRACTS.TEMPTATION.address,
  contractName: CONTRACTS.TEMPTATION.name,
  functionName: 'claim-temptation',
  functionArgs: [],
  postConditionMode: PostConditionMode.Allow
};

export const UPDATE_LEADERBOARD_OPTIONS = {
  contractAddress: CONTRACTS.LEADERBOARD.address,
  contractName: CONTRACTS.LEADERBOARD.name,
  functionName: 'update-my-position',
  functionArgs: [],
  postConditionMode: PostConditionMode.Allow
};

export function getClaimBadgeOptions(badgeId: number) {
  return {
    contractAddress: CONTRACTS.NFT.address,
    contractName: CONTRACTS.NFT.name,
    functionName: 'claim-badge',
    functionArgs: [uintCV(badgeId)],
    postConditionMode: PostConditionMode.Allow
  };
}
