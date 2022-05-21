import './style.css'
import { ModalProps } from '../../utils/modal';
import Close from '../../assets/icons/close.png'
import { TokenCardProps } from '../../types'
import { getOpenSeaLink } from '../../utils/tokens'
import { Spinner } from 'react-bootstrap';

export default function CollateralPopup({ data, show, onClose, loading }: ModalProps) {

  const TokenCard = ({ data }: TokenCardProps) => {
    return <div className="tokenContainer">
      <img id="tokenImage" src={data.media[0].gateway}/>
      <div className="tokenInfo">
        <p><a 
          href={getOpenSeaLink(data)}
          target="_blank"
          rel="noopener noreferrer"
        >{data.title}</a></p>
        {/* <p id="floorPrice">{data.floor} ETH</p> */}
      </div>
    </div>
  }

  return <div className="modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="tokenModalContainer">
      <div className="modalHeader">
        <h4 id="collateralPopupTitle">Collateral</h4>
        <img src={Close} id="closeIcon" onClick={onClose}/>
      </div>

      {loading ? <Spinner animation="border" variant="light" style={{
        position: 'absolute',
        right: '45%',
        bottom: '40%',
      }}/> : <div className="modalContent">
        <TokenCard data={data}/>
      </div>}
    </div>
  </div>
}