import { BigNumber } from "ethers"

export interface Loan {
  id: number
  lender: string
  borrower: string
  amount: BigNumber
  interest: number
  collateral: [string, BigNumber]
  deadline: number
  lenderConfirmed: boolean
  borrowerConfirmed: boolean
  active: boolean
  executed: boolean
  loanPaid: boolean
  collateralClaimed: boolean
}