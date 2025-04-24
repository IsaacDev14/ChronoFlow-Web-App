
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';  // Adjust according to your structure


const App = () => {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes as necessary */}
      </Routes>
    </Router>
  );
};

export default App;
