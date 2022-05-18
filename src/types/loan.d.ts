import { BigNumber } from "ethers"

export interface Loan {
  lender: string
  borrower: string
  amount: number
  interest: number
  collateral: [string, BigNumber]
  deadline: number
  lenderConfirmed: boolean
  borrowerConfirmed: boolean
  active: boolean
  executed: boolean
}