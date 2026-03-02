import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/website" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
