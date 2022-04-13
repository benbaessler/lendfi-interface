import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { GlobalStore } from './state/global'

const getLibrary = (provider: any) => {
  return new Web3Provider(provider)
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStore>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </GlobalStore>
  </React.StrictMode>,
  document.getElementById('root')
);
