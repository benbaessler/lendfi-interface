import './App.css';
import { useState } from 'react'
import { Button } from 'react-bootstrap';
import { providers } from 'ethers'
import { useWeb3React } from "@web3-react/core"
import { useEagerConnect, useInactiveListener } from './hooks'
import { injected } from './connectors'

function App() {
  const { active, account, activate } = useWeb3React()

  const connectWallet = async () => {
    try { await activate(injected) }
    catch (error) { console.error(error) }
  }

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  return (
    <div className="App">
      <Button onClick={connectWallet}>Connect Wallet</Button>
    </div>
  );
}

export default App;