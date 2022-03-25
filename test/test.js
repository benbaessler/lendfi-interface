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

    it('Should not let third party confirm loan', async () => {
      await expect(contract.connect(user3).confirmLender(0)).to.be.revertedWith('You are not the lender of this loan')
      await expect(contract.connect(user3).confirmBorrower(0)).to.be.revertedWith('You are not the borrower of this loan')
    })
  })

  describe('Executing a loan', () => {

    beforeEach(async () => {
      await contract.submitLoan(
        user1.address, 
        user2.address, 
        ethers.utils.parseEther('.5'),
        { contractAddress: collateral.address, tokenId: 1 },
        1234567
      )

      // Confirming lender
      await contract.confirmLender(0, { value: ethers.utils.parseEther('.5') })

      // Confirming borrower
      await collateral.connect(user2).mint()
      await collateral.connect(user2).setApprovalForAll(contract.address, true)
      await contract.connect(user2).confirmBorrower(0)
    })

    it('Should activate loan as both parties confirm loan', async () => {
      const loan = await contract.getLoan(0)
      expect(loan.active).to.equal(true)
    })

    it('Should let borrower pay back loan', async () => {
      const balanceBefore = await user1.getBalance()
      await contract.connect(user2).paybackLoan(0, { value: ethers.utils.parseEther('.5') })

      const loan = await contract.getLoan(0)
      const balanceAfter = await user1.getBalance()

      expect(balanceAfter).to.equal(balanceBefore.add(ethers.utils.parseEther('.5')))
    })

    it('Should return collateral to borrower after payback', async () => {
      await contract.connect(user2).paybackLoan(0, { value: ethers.utils.parseEther('.5') })

      const userCollateralBalance = await collateral.balanceOf(user2.address)
      const contractCollateralBalance = await collateral.balanceOf(contract.address)

      expect(userCollateralBalance).to.equal(1)
      expect(contractCollateralBalance).to.equal(0)
    })

    it('Should execute loan after payback', async () => {
      await contract.connect(user2).paybackLoan(0, { value: ethers.utils.parseEther('.5') })

      const loan = await contract.getLoan(0)

      expect(loan.executed).to.equal(true)
      expect(loan.active).to.equal(false)
    })

  })

});