import axios from 'axios'

const baseUrl = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/`

export const getTokens = async (address: string) => {
  const response = await axios.get(baseUrl + `getNFTs?owner=${address}`)
  return response.data.ownedNfts
}

export const getToken = async (address: string, tokenId: number) => {
  const response = await axios.get(baseUrl + `getNFTMetadata?contractAddress=${address}&tokenId=${tokenId}&tokenType=erc721`)
  return response.data
}