import { Loan } from "../types/loan"

export const getStatusDetails = (data: Loan) => {
  let status: string
  let statusColor: string
  if (data.active) {
    status = 'Active'
    statusColor = '#14c443'
  } else if (data.executed) {
    status = 'Executed'
    statusColor = '#ff0000'
  } else {
    status = 'Initialized'
    statusColor = 'white'
  }

  return [status, statusColor]
}

export const formatDeadline = (unixTimestamp: number) => {
  return new Date(unixTimestamp * 1000)
}

export const getConfirmations = (data: Loan) => {
  let confirmations: number = 0
  if (data.lenderConfirmed) confirmations++
  if (data.borrowerConfirmed) confirmations++
  return confirmations
}