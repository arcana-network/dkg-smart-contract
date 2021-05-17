import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { NodeList, NodeList__factory } from "../typechain";

describe("NodeList", () => {
  let nodelist: NodeList, signers: SignerWithAddress[];

  beforeEach("Deploy Contracts", async () => {
    const NodeListFactory: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
    nodelist = await NodeListFactory.deploy();
    await nodelist.deployed();
  });

  describe("After Deploy", () => {
    it("should have valid address", async () => {
      expect(nodelist.address).to.not.equal(ethers.constants.AddressZero);
    });
  });
});
