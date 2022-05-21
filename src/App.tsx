import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom'
import { useEagerConnect, useInactiveListener } from './hooks'
import Create from './pages/Create';
import Loans from './pages/Loans';
import About from './pages/About';
import { LoanPage } from './pages/Loan';
import NavigationBar from './components/NavigationBar';
import Landing from './pages/Landing';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useContext } from 'react'
import { EnteredContext } from './state/entered' 

function App() {
  const [entered, setEntered] = useContext(EnteredContext)

  // Ethereum & Contract
  const { active } = useWeb3React()

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  useEffect(() => {
    if (active) setEntered(true)
  }, [])
  
  return <Switch>
    <div className="App">
      <NavigationBar/>
      {active ? 
      <>
        <Route path="/" exact render={() => <Redirect to="/loans"/>}/>
        <Route path="/loans" exact component={Loans}/>
        <Route path="/loan/:id" exact component={LoanPage}/>
        <Route path="/create" exact component={Create}/>
        <Route path="/about" exact component={About}/> 
      </>
      : 
      <>
        <Route path="/" exact component={Landing}/>
        <Route path="/" render={() => <Redirect to="/"/>}/>
      </>
      }
    </div>
  </Switch>
}

export default App;