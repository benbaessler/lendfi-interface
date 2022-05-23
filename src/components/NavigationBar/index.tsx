import './style.css'
import { useContext } from 'react'
import { NavigationContext } from '../../state/navigation'
import { injected } from '../../connectors'
import Logo from '../../assets/icons/logo.png'
import { useWeb3React } from "@web3-react/core"
import { shortenAddress } from '../../utils'
import { useHistory } from "react-router-dom";
import QuestionIcon from '../../assets/icons/question.png'

export default function NavigationBar() {
  const { active, account, activate } = useWeb3React()
  const history = useHistory()
  const [navSelection] = useContext(NavigationContext)

  const connectWallet = async () => {
    try { await activate(injected) }
    catch (error) { console.error(error) }
  }

  return <div className="navigationBarContainer">
    <img src={Logo} onClick={() => history.replace('')} id="logo"/>

    {active ? <div>
      <span style={{ 
        marginRight: '18px',
        opacity: navSelection === 'loans' ? 1 : .7
      }} onClick={() => history.replace('/loans')}>Loans</span>
      <span style={{
        opacity: navSelection === 'create' ? 1 : .7
      }} onClick={() => history.replace('/create')}>Create</span>
    </div> : <div/>}

    <div className="walletSection">
      <img src={QuestionIcon} id="navQuestionBtn" onClick={() => history.replace('/about')}/>
      {active ? <div className="userContainer">
        {shortenAddress(account!)}
      </div> : <div className="button submitButton" id="navbarConnectBtn" onClick={connectWallet}>
        Enter App
      </div>}
    </div>
  </div>
}