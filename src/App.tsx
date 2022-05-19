import './App.css';
import { Route, Switch } from 'react-router-dom'
import { useEagerConnect, useInactiveListener } from './hooks'
import Create from './pages/Create';
import Loans from './pages/Loans';
import { LoanPage } from './pages/LoanPage';
import NavigationBar from './components/NavigationBar';

function App() {
  // Ethereum & Contract
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  
  // Add Redirect from /loans to /
  return <Switch>
    <div className="App">
      <NavigationBar/>
      <Route path="/loans" exact component={Loans}/>
      <Route path="/loan/:id" exact component={LoanPage}/>
      <Route path="/create" exact component={Create}/>
    </div>
  </Switch>
}

export default App;