import { Loan } from "../types/loan"

export const getStatusDetails = (data: Loan) => {
  const expired: boolean = Number(data.deadline) < Math.round(Date.now() / 1000)

  let status: string
  let statusColor: string
  if (data.active && !expired) {
    status = 'Active'
    statusColor = '#14c443'
  } else if (data.active && expired) {
    status = 'Expired'
    statusColor = 'rgba(256, 256, 256, .5)'
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