import './App.css';
import { useEagerConnect, useInactiveListener } from './hooks'
import { providers, Contract } from 'ethers'
import { getContract } from './utils/contract';
import { useWeb3React } from '@web3-react/core';

import Create from './pages/Create';
import Loans from './pages/Loans';
import NavigationBar from './components/NavigationBar';
import { Route, Switch } from 'react-router-dom'
import { useEffect } from 'react';

function App() {
  
  const { library, active } = useWeb3React()

  // Ethereum & Contract
  let provider: providers.Web3Provider
  let signer: providers.JsonRpcSigner
  let factoryContract: Contract

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  useEffect(() => {
    if (active) {
      provider = new providers.Web3Provider(library.provider)
      signer = provider.getSigner()
      factoryContract = getContract(signer)
    }
  }, [active])
  
  return <Switch>
    <div className="App">
      <NavigationBar/>
      <Route path="/" exact component={Loans}/>
      <Route path="/create" component={Create}/>
    </div>
  </Switch>
}

export default App;