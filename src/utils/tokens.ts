import axios from 'axios'
import { BigNumber } from 'ethers'
import { networkName, openseaBaseUrl } from '../constants'
import { AlchemyAPIToken } from '../types'

const baseUrl = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/`

export const getTokens = async (address: string) => {
  const response = await axios.get(baseUrl + `getNFTs?owner=${address}`)
  return response.data.ownedNfts
}

export const getToken = async (address: string, tokenId: number) => {
  const response = await axios.get(baseUrl + `getNFTMetadata?contractAddress=${address}&tokenId=${tokenId}&tokenType=erc721`)
  return response.data
}

export const getOpenSeaLink = (data: AlchemyAPIToken) => {
  const result = openseaBaseUrl + `assets/${networkName}/${data.contract.address}/${BigNumber.from(data.id.tokenId)}`
  return result
}