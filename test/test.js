const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanFactory contract", () => {

  let contract
  let user1
  let user2

  beforeEach(async () => {
    const Loan = await ethers.getContractFactory('LoanFactory');
    [user1, user2] = await ethers.getSigners()

    contract = await Loan.deploy()
  })

  describe('Initiating a loan', () => {

    beforeEach(async () => {
      await contract.submitLoan(
        user1.address, 
        user2.address, 
        100,
        { contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', tokenId: 1 },
        1234567
      )
    })

    it('Should be able to submit a loan', async () => {
      const loan = await contract.getLoan(0)
      
      expect(loan.lender).to.equal(user1.address)
      expect(loan.borrower).to.equal(user2.address)
      expect(loan.amount).to.equal(100)
    })

    it('Should let participators confirm the loan', async () => {
      await contract.confirmLoan(0)
      const loan = await contract.getLoan(0)

      expect(loan.confirmations).to.equal(1)
    })

    it('Should let participators revoke confirmation', async () => {
      await contract.confirmLoan(0)
      await contract.revokeConfirmation(0)

      const loan = await contract.getLoan(0)
      expect(loan.confirmations).to.equal(0)
    })

  })

});