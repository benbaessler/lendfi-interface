import './style.css'
import Close from '../../assets/icons/close.png'

export default function TokenModal({ show, onClose, address }) {

  const testToken = {
    image_url: 'https://lh3.googleusercontent.com/alxzTsKKU0U4nGkdLPxf7s45SSzKzTeewI_yqek9MEO7z2loQJ8tE6zL0eYjWxVwQigh_3Pt7Rq-2rNuZlf8B6t8eeChat56eTEUIg=w600',
    name: 'Psychedelics Anonymous Genesis #1234',
    permalink: 'https://opensea.io/assets/0x75e95ba5997eb235f40ecf8347cdb11f18ff640b/1234',
    floor: 2.8
  }

  const TokenCard = ({ data }) => {
    return <div className="tokenContainer">
      <img src={data.image_url}/>
      <div className="tokenInfo">
        <p>{data.name}</p>
        <p id="floorPrice">{data.floor} ETH</p>
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
        <TokenCard data={testToken}/>
        <TokenCard data={testToken}/>
        <TokenCard data={testToken}/>
        <TokenCard data={testToken}/>
      </div>
    </div>
  </div>
}