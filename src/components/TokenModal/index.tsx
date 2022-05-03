import './style.css'
import { useState, useEffect, useContext } from 'react'
import { AlchemyAPIToken, TokenCardProps } from '../../types'
import { CollateralContext } from '../../state/collateral';
import Close from '../../assets/icons/close.png'
import Checkmark from '../../assets/icons/checkmark.png'

interface Props {
  data: Array<AlchemyAPIToken>
  show: boolean
  onClose: () => void
}

export default function TokenModal({ data, show, onClose }: Props) {

  const [collateral, setCollateral] = useContext(CollateralContext)

  const TokenCard = ({ data }: TokenCardProps) => {
    let isSelected: boolean = false
    collateral.forEach((token: AlchemyAPIToken) => {
      if (data === token) isSelected = true
    })

    const [selected, setSelected] = useState<boolean>(isSelected)

    const selectToken = () => {
      const _collateral = collateral

      if (selected) {
        const itemIndex = _collateral.indexOf(data)
        if (itemIndex > -1) _collateral.splice(itemIndex, 1)
      } else {
        _collateral.push(data)
        onClose()
      }

      setCollateral(_collateral)
      setSelected(!selected)
    }

    return <div className="tokenContainer"
      style={{ color: selected ? 'black' : 'white' }}
      onClick={selectToken}
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
        {data.map((token: AlchemyAPIToken) => <TokenCard data={token}/>)}
      </div>
    </div>
  </div>
}