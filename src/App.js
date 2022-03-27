import './App.css';
import { useEagerConnect, useInactiveListener } from './hooks'

import Create from './pages/Create';
import NavigationBar from './components/NavigationBar';

function App() {

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  return (
    <div className="App">
      <NavigationBar/>
      <Create/>
    </div>
  );
}

export default App;