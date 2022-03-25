const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanFactory contract", () => {

  let contract
  let collateral
  let user1
  let user2
  let user3

  beforeEach(async () => {
    [user1, user2, user3] = await ethers.getSigners()

    const Loan = await ethers.getContractFactory('LoanFactory');
    contract = await Loan.deploy()

    const Collateral = await ethers.getContractFactory('Collateral') 
    collateral = await Collateral.deploy()
  })

  describe('Initiating a loan', () => {

    beforeEach(async () => {
      await contract.submitLoan(
        user1.address, 
        user2.address, 
        ethers.utils.parseEther('.5'),
        { contractAddress: collateral.address, tokenId: 1 },
        1234567
      )
    })

    it('Should be able to submit a loan', async () => {
      const loan = await contract.getLoan(0)
      
      expect(loan.lender).to.equal(user1.address)
      expect(loan.borrower).to.equal(user2.address)
      expect(loan.amount).to.equal(ethers.utils.parseEther('.5'))
    })

    it('Should let lender confirm loan with loan deposit', async () => {
      await contract.confirmLender(0, { value: ethers.utils.parseEther('.5') })

      const loan = await contract.getLoan(0)
      const contractBalance = await contract.getContractBalance()

      expect(loan.lenderConfirmed).to.equal(true)
      expect(contractBalance).to.equal(ethers.utils.parseEther('.5'))
    })

    it('Should let borrower confirm loan with collateral deposit', async () => {
      await collateral.connect(user2).mint()

      await collateral.connect(user2).setApprovalForAll(contract.address, true)
      await contract.connect(user2).confirmBorrower(0)

      const loan = await contract.getLoan(0)
      const collateralBalance = await collateral.balanceOf(contract.address)

      expect(loan.borrowerConfirmed).to.equal(true)
      expect(collateralBalance).to.equal(1)
    })

    it('Should activate loan as both parties confirm the loan', async () => {
      // Confirming lender
      await contract.confirmLender(0, { value: ethers.utils.parseEther('.5') })

      // Confirming borrower
      await collateral.connect(user2).mint()
      await collateral.connect(user2).setApprovalForAll(contract.address, true)
      await contract.connect(user2).confirmBorrower(0)

      const loan = await contract.getLoan(0)
      expect(loan.active).to.equal(true)
    })

    // it('Should not let third party confirm loan', async () => {
    //   await expect(contract.connect(user3).confirmLender(0)).to.be.revertedWith('You are not the lender of this loan')
    // })
  })
});