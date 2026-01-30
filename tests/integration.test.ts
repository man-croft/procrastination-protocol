import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Procrastination Protocol Integration", () => {
  it("completes a full user journey", () => {
    // 1. Start Procrastinating
    simnet.callPublicFn("procrastination-vault-v2", "start-procrastinating", [Cl.uint(10000000)], wallet1);

    // 2. Wait 7 days (1008 blocks)
    simnet.mineEmptyBlocks(1008);

    // 3. Claim Badges
    simnet.callPublicFn("achievement-nft-v2", "claim-badge", [Cl.uint(1)], wallet1); // Beginner
    simnet.callPublicFn("achievement-nft-v2", "claim-badge", [Cl.uint(2)], wallet1); // Expert

    // 4. Update Leaderboard
    simnet.callPublicFn("leaderboard-v2", "update-my-position", [], wallet1);
    const lb = simnet.callReadOnlyFn("leaderboard-v2", "get-leaderboard", [], wallet1);
    // Should see wallet1 with 1008 blocks
    
    // 5. Temptation Event (Noon Nap at mod 72)
    // Current block might be off, let's calculate needed blocks
    const currentHeight = simnet.blockHeight;
    const mod = currentHeight % 144;
    const target = 72;
    const toMine = target >= mod ? target - mod : (144 - mod) + target;
    simnet.mineEmptyBlocks(toMine);

    // 6. Claim Temptation (Breaks Streak)
    // Seed pool first for bonus payout
    simnet.callPublicFn("penalty-pool-v2", "receive-penalty", [Cl.uint(10000000)], deployer);

    const claimTemp = simnet.callPublicFn("temptation-generator-v2", "claim-temptation", [], wallet1);
    expect(claimTemp.result).toBeOk(Cl.bool(true));

    // Verify streak ended
    const streak = simnet.callReadOnlyFn("streak-tracker-v2", "get-streak-blocks", [Cl.principal(wallet1)], wallet1);
    expect(streak.result).toBeOk(Cl.uint(0)); // Reset

    // 7. Restart and Quit
    simnet.callPublicFn("procrastination-vault-v2", "start-procrastinating", [Cl.uint(5000000)], wallet1);
    simnet.mineEmptyBlocks(10);
    const quit = simnet.callPublicFn("procrastination-vault-v2", "quit-procrastinating", [], wallet1);
    expect(quit.result).toBeOk(Cl.bool(true));
  });
});
