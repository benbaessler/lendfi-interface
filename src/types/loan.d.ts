export interface Loan {
  lender: string
  borrower: string
  amount: number
  interest: number
  collateral: []
  deadline: number
  lenderConfirmed: boolean
  borrowerConfirmed: boolean
  active: boolean
  executed: boolean
}