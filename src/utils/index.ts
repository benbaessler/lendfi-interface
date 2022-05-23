import { getAddress } from '@ethersproject/address'

export function isAddress(value: string) {
  try {
    const _ = getAddress(value)
    return true
  } catch {
    return false
  }
}

export function shortenAddress(address: string, chars = 4) {
  if (address === '') return ''
  const valid = isAddress(address)
  if (!valid) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}