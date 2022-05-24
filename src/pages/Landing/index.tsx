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

  return <>{!entered ? <div className="landingContainer">
    <div className="landingWelcomeContainer">
      <h1>Welcome to <span id="welcomeTitle">LendFi</span></h1>
      <h6>Easily lend or borrow crypto using fully secure and autonomous smart contracts with NFT collateral.</h6>
      <div className="button submitButton" id="landingEnterBtn" onClick={connectWallet}>Get Started</div>
    </div>
    <div className="landingBrandingContainer">
      <img src={LandingImage}/>
    </div>
  </div> : <div/>}
  </>
}