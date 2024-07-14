import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Login';
import AIChat from './AIChat';
import Mediator from './Mediator';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<AIChat />} />
      <Route path="/mediator" element={<Mediator />} />
    </Routes>
  );
}

export default App;
