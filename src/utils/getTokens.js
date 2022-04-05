import axios from 'axios'

export default async function getTokens(address) {

  const baseUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/getNFTs/`

  const config = {
    method: 'get',
    url: `${baseUrl}?owner=${address}`
  }

  const response = await axios(config)

  // const options = {
  //   method: 'GET',
  //   url: `https://api.nftport.xyz/v0/accounts/${address}`,
  //   params: {chain: 'ethereum', page_size: '5', continuation: 'None', include: 'metadata'},
  //   headers: {'Content-Type': 'application/json', Authorization: process.env.REACT_APP_NFTPORT_API_KEY}
  // };

  // const response = await axios.request(options)
  return response.data
}