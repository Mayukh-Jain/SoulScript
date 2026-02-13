import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreatorPage from './CreatorPage';
import ProposalPage from './ProposalPage';
import RevealPage from './RevealPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatorPage />} />
        {/* The link shared with the partner leads here first */}
        <Route path="/reveal" element={<ProposalPage />} />
        {/* The hidden story page unlocked after clicking 'Yes' */}
        <Route path="/story" element={<RevealPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;