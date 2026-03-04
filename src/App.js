import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import Blog1 from './components/screens/blogs/Blog1';
import BlogDetail from './components/screens/blogs/BlogDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog1" element={<Blog1 />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
