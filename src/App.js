import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './mediator/Login';
import AIChat from './mediator/AIChat';
import PartyiInitiatedChat from './mediator/PartyiInitiatedChat';
import Mediator from './mediator/Mediator';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<AIChat />} />
      <Route path="/pchat/:conversation_id" element={<PartyiInitiatedChat />} />
      <Route path="/pchat" element={<PartyiInitiatedChat />} />
      <Route path="/mediator" element={<Mediator />} />
      
    </Routes>
  );
}

export default App;
