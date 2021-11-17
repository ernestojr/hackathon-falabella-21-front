import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Rules from './pages/Rules';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route path="/analytics" element={<Analytics />}/>
          <Route path="/rules" element={<Rules />}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
