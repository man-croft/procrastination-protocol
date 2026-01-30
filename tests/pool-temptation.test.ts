import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Pool & Temptation Tests", () => {
  it("only allows vault to request rewards", () => {
    // Non-vault caller (wallet1) should fail
    const result = simnet.callPublicFn(
      "penalty-pool-v2",
      "request-reward",
      [Cl.uint(100), Cl.principal(wallet1)],
      wallet1
    );
    expect(result.result).toBeErr(Cl.uint(401));
  });

  it("identifies temptations correctly", () => {
    // Block height 0 -> mod 144 is 0 -> Midnight Snack
    const temptation0 = simnet.callReadOnlyFn(
      "temptation-generator-v2",
      "get-current-temptation",
      [],
      wallet1
    );
    expect(temptation0.result).toBeOk(Cl.tuple({
      name: Cl.stringAscii("Midnight Snack"),
      bonus: Cl.uint(1000000)
    }));

    // Advance 72 blocks -> Noon Nap
    simnet.mineEmptyBlocks(72);
    const temptation72 = simnet.callReadOnlyFn(
      "temptation-generator-v2",
      "get-current-temptation",
      [],
      wallet1
    );
    expect(temptation72.result).toBeOk(Cl.tuple({
      name: Cl.stringAscii("Noon Nap"),
      bonus: Cl.uint(5000000)
    }));

    // Advance 1 block -> No Event
    simnet.mineEmptyBlocks(1);
    const temptation73 = simnet.callReadOnlyFn(
      "temptation-generator-v2",
      "get-current-temptation",
      [],
      wallet1
    );
    expect(temptation73.result).toBeErr(Cl.uint(404));
  });

  it("prevents double claiming temptations", () => {
    // Start streak first (needed for apply-bonus)
    simnet.callPublicFn(
      "procrastination-vault-v2",
      "start-procrastinating",
      [Cl.uint(1000000)],
      wallet1
    );

    // Current block is 73 (from previous test + mining).
    // Let's mine until next event (144). 144 - 73 = 71 blocks.
    simnet.mineEmptyBlocks(71); // Height 144

    // Claim first time
    const result1 = simnet.callPublicFn(
      "temptation-generator-v2",
      "claim-temptation",
      [],
      wallet1
    );
    expect(result1.result).toBeOk(Cl.bool(true));

    // Claim second time same block
    const result2 = simnet.callPublicFn(
      "temptation-generator-v2",
      "claim-temptation",
      [],
      wallet1
    );
    expect(result2.result).toBeErr(Cl.uint(409)); // ALREADY_CLAIMED
  });
});
