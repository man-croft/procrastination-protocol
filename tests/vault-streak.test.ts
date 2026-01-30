import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Vault & Streak Tests", () => {
  it("allows user to start procrastinating", () => {
    const amount = 1000000; // 1 STX
    const result = simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(amount)],
      wallet1
    );
    expect(result.result).toBeOk(Cl.bool(true));

    // Check locked amount
    const locked = simnet.callReadOnlyFn(
      "procrastination-vault-v2",
      "get-locked-amount",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(locked.result).toBeOk(Cl.uint(amount));

    // Check streak started
    const streak = simnet.callReadOnlyFn(
      "streak-tracker-v2",
      "get-streak-blocks",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(streak.result).toBeOk(Cl.uint(0));
  });

  it("calculates streak days correctly", () => {
    // Start streak
    simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(1000000)],
      wallet1
    );

    // Advance 144 blocks (1 day)
    simnet.mineEmptyBlocks(144);

    const days = simnet.callReadOnlyFn(
      "streak-tracker-v2",
      "get-streak-days",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(days.result).toBeOk(Cl.uint(1));
  });

  it("applies penalty on quit", () => {
    const amount = 1000000;
    simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(amount)],
      wallet1
    );

    // Quit immediately
    const result = simnet.callPublicFn(
      "procrastination-vault-v2",
      "quit-procrastinating",
      [],
      wallet1
    );
    expect(result.result).toBeOk(Cl.bool(true));

    // Check penalty pool received funds (10% = 100000)
    const poolBalance = simnet.callReadOnlyFn(
      "penalty-pool-v2",
      "get-balance",
      [],
      wallet1
    );
    expect(poolBalance.result).toBeOk(Cl.uint(100000));
  });

  it("claims rewards with bonus after streak", () => {
    const amount = 1000000;
    
    // Seed the pool so there is a bonus to pay out
    simnet.callPublicFn(
      "penalty-pool-v2",
      "receive-penalty",
      [Cl.uint(500000)], // 0.5 STX in pool
      deployer
    );

    simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(amount)],
      wallet1
    );

    // Advance 1008 blocks (7 days) -> 1% bonus
    simnet.mineEmptyBlocks(1008);

    const bonusPreview = simnet.callReadOnlyFn(
      "procrastination-vault-v2",
      "get-current-bonus",
      [Cl.principal(wallet1)],
      wallet1
    );
    // 1% of 1,000,000 is 10,000
    expect(bonusPreview.result).toBeOk(Cl.uint(10000));

    // Claim
    const result = simnet.callPublicFn(
      "procrastination-vault-v2",
      "claim-rewards",
      [],
      wallet1
    );
    expect(result.result).toBeOk(Cl.bool(true));
  });
});
