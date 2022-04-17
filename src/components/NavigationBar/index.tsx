import './style.css'
import { injected } from '../../connectors'
import Logo from '../../assets/icons/logo.png'
import { useWeb3React } from "@web3-react/core"
import { shortenAddress } from '../../utils'
import { useHistory } from "react-router-dom";

export default function NavigationBar() {
  const { active, account, activate } = useWeb3React()
  const history = useHistory()

  const connectWallet = async () => {
    try { await activate(injected) }
    catch (error) { console.error(error) }
  }

  return <div className="navigationBarContainer">
    <img src={Logo} onClick={() => history.push('')} id="logo"/>

    <div>
      <span style={{ marginRight: '18px' }} onClick={() => history.push('')}>Loans</span>
      <span onClick={() => history.push('create')}>Create</span>
    </div>

    <div className="walletSection">
      {active ? <div className="userContainer">
        {shortenAddress(account!)}
      </div> : <div className="button submitButton" id="navbarConnectBtn" onClick={connectWallet}>
        Connect Wallet
      </div>}
    </div>
  </div>
}