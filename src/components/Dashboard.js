// src/components/Dashboard.js

import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import CapturePhoto from './CapturePhoto'; // Import CapturePhoto component

import io from 'socket.io-client';

const socket = io('https://beer-tracker-backend.onrender.com'); // Adjust if needed

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleScoreIncrement = (increment) => {
    // Emit the score increment event to the backend
    socket.emit('incrementScore', increment);
  };

  return (
    <div className="dashboard-container">
      <h2>BBQ & Beer Tracker</h2>
      <CapturePhoto onScoreIncrement={handleScoreIncrement} /> {/* Include the CapturePhoto component */}
      <a href="/leaderboard" className="leaderboard-button">Go to Leaderboard</a> {/* Link to Leaderboard */}
    </div>
  );
};

export default Dashboard;
