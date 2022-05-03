import './App.css';
import { Route, Switch } from 'react-router-dom'
import { useEagerConnect, useInactiveListener } from './hooks'
import Create from './pages/Create';
import Loans from './pages/Loans';
import NavigationBar from './components/NavigationBar';

function App() {
  // Ethereum & Contract
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  
  return <Switch>
    <div className="App">
      <NavigationBar/>
      <Route path="/" exact component={Loans}/>
      <Route path="/create" component={Create}/>
    </div>
  </Switch>
}

export default App;