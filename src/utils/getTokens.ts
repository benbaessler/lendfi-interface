import axios from 'axios'

export default async function getTokens(address: string) {
  const baseUrl = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/getNFTs/`
  const response = await axios.get(`${baseUrl}?owner=${address}`)

  return response.data.ownedNfts
}