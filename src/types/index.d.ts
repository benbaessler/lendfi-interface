export interface AlchemyAPIToken {
  balance: string
  contract: { address: string }
  description: string
  id: { tokenId: string, tokenMetadata: { tokenType: string } }
  media: Array<{ gateway: string, raw: string }>
  metadata: AlchemyAPITokenMetadata
  timeLastUpdated: string
  title: string
  tokenUri: { gateway: string, raw: string }
}

interface AlchemyAPITokenMetadata {
  attributes: Array<{ trait_type: string, value: string }>
  compiler: string
  date: number
  description: string
  dna: string
  edition: number
  image: string
  name: string
}