import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatorPage from './CreatorPage';
import RevealPage from './RevealPage';
import './index.css'; // Use index.css for global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatorPage />} />
        <Route path="/reveal" element={<RevealPage />} />
      </Routes>
    </Router>
  );
}

export default App;