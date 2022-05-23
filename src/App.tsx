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
import { NavigationContext } from './state/navigation';

function App() {
  const [entered, setEntered] = useContext(EnteredContext)
  const [navSelected, setNavSelected] = useContext(NavigationContext)

  // Ethereum & Contract
  const { active } = useWeb3React()

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  useEffect(() => {
    if (active) setEntered(true)
  }, [active])
  
  return <Switch>
    <div className="App">
      <NavigationBar/>
      {entered ? 
        <>
          <Route path="/" exact render={() => {
            return <Redirect to="/loans"/>
          }}/> 
          <Route path="/loans" exact render={() => {
            setNavSelected('loans')
            return <Loans/>
          }}/>
          <Route path="/loan/:id" exact render={(props: any) => {
            setNavSelected('loan')
            return <LoanPage {...props}/>
          }}/>
          <Route path="/create" exact render={() => {
            setNavSelected('create')
            return <Create/>
          }}/>
          <Route path="/about" exact render={() => {
            setNavSelected('about')
            return <About/>
          }}/> 
        </>
      : <Route path="/" exact component={Landing}/>}
      
    </div>
  </Switch>
}

export default App;