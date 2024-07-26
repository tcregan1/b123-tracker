// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register'; // Import Register component
import Leaderboard from './components/Leaderboard';
import AuthProvider from './AuthContext';
import { SocketProvider } from './SocketProvider'; // Import the SocketProvider
import './styles.css'; // Import the global styles

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} /> {/* Add Register route */}
            <Route path="/leaderboard" element={<Leaderboard />} /> {/* Add route for Leaderboard */}
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
