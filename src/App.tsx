import './App.css';
import { useEagerConnect, useInactiveListener } from './hooks'

import Create from './pages/Create';
import Loans from './pages/Loans';
import NavigationBar from './components/NavigationBar';
import { Route, Switch } from 'react-router-dom'

function App() {

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  
  return <Switch>
    <div className="App">
      <NavigationBar/>
      <Route path="/" component={Loans}/>
      <Route path="/create" component={Create}/>
    </div>
  </Switch>
}

export default App;