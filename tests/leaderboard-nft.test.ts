import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Leaderboard & NFT Tests", () => {
  it("allows claiming badges when eligible", () => {
    // Start streak
    simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(1000000)],
      wallet1
    );

    // Try claiming immediately (should fail)
    const failClaim = simnet.callPublicFn(
      "achievement-nft-v2",
      "claim-badge",
      [Cl.uint(1)], // BADGE-BEGINNER (1 day)
      wallet1
    );
    expect(failClaim.result).toBeErr(Cl.uint(403)); // NOT_ELIGIBLE

    // Mine 1 day (144 blocks)
    simnet.mineEmptyBlocks(144);

    // Claim success
    const successClaim = simnet.callPublicFn(
      "achievement-nft-v2",
      "claim-badge",
      [Cl.uint(1)],
      wallet1
    );
    expect(successClaim.result).toBeOk(Cl.uint(1)); // Token ID 1

    // Verify ownership
    const owner = simnet.callReadOnlyFn(
      "achievement-nft-v2",
      "get-owner",
      [Cl.uint(1)],
      wallet1
    );
    expect(owner.result).toBeOk(Cl.some(Cl.principal(wallet1)));

    // Verify URI
    const uri = simnet.callReadOnlyFn(
      "achievement-nft-v2",
      "get-token-uri",
      [Cl.uint(1)],
      wallet1
    );
    expect(uri.result).toBeOk(Cl.some(Cl.stringAscii("https://procrastination.com/badges/1")));
  });

  it("updates leaderboard positions", () => {
    // Wallet 1 streak is already 144 blocks from previous test
    const update1 = simnet.callPublicFn(
      "leaderboard-v2",
      "update-my-position",
      [],
      wallet1
    );
    expect(update1.result).toBeOk(Cl.list([
      Cl.tuple({ user: Cl.principal(wallet1), blocks: Cl.uint(144) })
    ]));

    // Wallet 2 joins
    simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(2000000)],
      wallet2
    );
    // Mine 10 blocks
    simnet.mineEmptyBlocks(10);
    
    // Wallet 1 streak is now 154, Wallet 2 is 10.
    // Update Wallet 2
    const update2 = simnet.callPublicFn(
      "leaderboard-v2",
      "update-my-position",
      [],
      wallet2
    );
    // List should have both
    const list = simnet.callReadOnlyFn(
      "leaderboard-v2",
      "get-leaderboard",
      [],
      wallet1
    );
    // Expect list of length 2 (order depends on implementation, but both should be there)
    // Actually the result of update2 returns the new list, we can check that or get-leaderboard
    expect(list.result).toBeOk(Cl.list([
        Cl.tuple({ user: Cl.principal(wallet1), blocks: Cl.uint(144) }), // Was 144 when updated
        Cl.tuple({ user: Cl.principal(wallet2), blocks: Cl.uint(10) })
    ]));
  });
});
