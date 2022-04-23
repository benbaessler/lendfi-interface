import { getAddress } from '@ethersproject/address'
import { providers } from 'ethers'

export function isAddress(value: string) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function shortenAddress(address: string, chars = 4) {
  if (address === '') return ''
  const parsed = isAddress(address)
  if (!parsed) {
    console.log(address)
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}