import './App.css';
import { Route, Switch } from 'react-router-dom'
import { useEagerConnect, useInactiveListener } from './hooks'
import Create from './pages/Create';
import Loans from './pages/Loans';
import About from './pages/About';
import { LoanPage } from './pages/Loan';
import NavigationBar from './components/NavigationBar';
import Landing from './pages/Landing';

function App() {
  // Ethereum & Contract
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  
  return <Switch>
    <div className="App">
      <NavigationBar/>
      <Route path="/" exact component={Landing}/>
      <Route path="/loans" exact component={Loans}/>
      <Route path="/loan/:id" exact component={LoanPage}/>
      <Route path="/create" exact component={Create}/>
      <Route path="/about" exact component={About}/>
    </div>
  </Switch>
}

export default App;