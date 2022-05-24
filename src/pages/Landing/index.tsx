import './style.css'
import { injected } from '../../connectors'
import { useWeb3React } from '@web3-react/core'
import LandingImage from '../../assets/images/landingAnimation.png'
import { EnteredContext } from '../../state/entered'
import { useContext } from 'react'

export default function Landing() {
  const { activate } = useWeb3React()
  const [entered, setEntered] = useContext(EnteredContext)

  const connectWallet = async () => {
    try { 
      await activate(injected) 
      setEntered(true)
    } catch (error) { console.error(error) }
  }

  return <>{!entered ? 
    <div className="landingWrapper">
      <div className="landingContainer">
        <div className="landingText">
          <h1>Welcome to LendFi</h1>
          <p>Easily lend or borrow crypto using fully secure and autonomous smart contracts with NFT collateral and 0% fees.</p>
        </div>
        <img src={LandingImage}/>
      </div>
    </div>
    

  : <div/>}
  </>
}