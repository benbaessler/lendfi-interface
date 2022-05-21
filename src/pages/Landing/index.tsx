import './style.css'
import { useContext } from 'react'
import { EnteredContext } from '../../state/appEntered'
import LandingImage from '../../assets/images/landing-animation.png'

export default function Landing() {
  const [appEntered, setAppEntered] = useContext(EnteredContext)

  return <div className="landingContainer">
    <div className="landingWelcomeContainer">
      <h1>Welcome to <span id="welcomeTitle">LendFi</span></h1>
      <h6>Easily lend or borrow crypto using fully secure and autonomous smart contracts with NFT collateral.</h6>
      <div className="button submitButton" id="landingEnterBtn">Get Started</div>
    </div>
    <div className="landingBrandingContainer">
      <img src={LandingImage}/>
    </div>
  </div>
}