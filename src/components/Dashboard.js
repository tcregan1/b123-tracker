// src/components/Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import IncrementScore from './IncrementScore';
import CapturePhoto from './CapturePhoto'; // Import CapturePhoto component

import io from 'socket.io-client';

const socket = io('https://beer-tracker-backend.onrender.com'); // Adjust if needed

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    socket.on('leaderboardUpdate', (users) => {
      setLeaderboard(users);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('leaderboardUpdate');
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Beer & BBQ Scoreboard Extravaganza!</h2>
      <IncrementScore />
      <CapturePhoto /> {/* Include the CapturePhoto component */}
      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.map((user) => (
          <li key={user._id}>{user.username}: {user.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
