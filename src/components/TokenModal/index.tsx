import './style.css'
import { useState, useEffect } from 'react'
import { AlchemyAPIToken } from '../../types'
import Close from '../../assets/icons/close.png'
import Checkmark from '../../assets/icons/checkmark.png'

interface Props {
  data: Array<AlchemyAPIToken>
  show: boolean
  onClose: () => void
}

interface Token {
  contract: string
  tokenId: string
}

interface TokenCardProps {
  data: AlchemyAPIToken
  // selected: boolean
  // set: () => void
}

export default function TokenModal({ data, show, onClose }: Props) {

  const TokenCard = ({ data }: TokenCardProps) => {
    const [selected, setSelected] = useState<boolean>(false)

    const tokenData: Token = {
      contract: data.contract.address,
      tokenId: data.id.tokenId
    }

    return <div className="tokenContainer"
      style={{ color: selected ? 'black' : 'white' }}
      onClick={() => setSelected(!selected)}
    >
      <img id="selectedIcon" src={Checkmark} style={{ display: selected ? '' : 'none'}}/>
      <img id="tokenImage" src={data.media[0].gateway} style={{ opacity: selected ? 1 : .8 }}/>
      <div className="tokenInfo">
        <p>{data.title}</p>
        {/* <p id="floorPrice">{data.floor} ETH</p> */}
      </div>
    </div>
  }

  return <div className="modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="tokenModalContainer">
      <div className="modalHeader">
        <h2>Select Tokens</h2>
        <img src={Close} id="closeIcon" onClick={onClose}/>
      </div>

      <div className="modalContent">
        {data.map((token: AlchemyAPIToken) => {
          const tokenData: Token = {
            contract: token.contract.address,
            tokenId: token.id.tokenId
          }

          return(
            <TokenCard 
              data={token} 
              // selected={selected == tokenData} 
              // set={() => setSelected(tokenData)}
            />
          )
        })}
      </div>
    </div>
  </div>
}