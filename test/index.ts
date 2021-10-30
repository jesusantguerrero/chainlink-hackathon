/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { getContract } from "../utils/getContract";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const greeter = await getContract("Greeter", ["Hello, world!"]);

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
