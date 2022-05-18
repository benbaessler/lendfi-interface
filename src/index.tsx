import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { GlobalStore } from './state'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const getLibrary = (provider: any) => {
  return new Web3Provider(provider)
}

ReactDOM.render(
  <BrowserRouter> 
    <React.StrictMode>
      <GlobalStore>
        <Web3ReactProvider getLibrary={getLibrary}>
          <App />
        </Web3ReactProvider>
      </GlobalStore>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
