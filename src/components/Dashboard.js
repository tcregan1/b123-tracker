import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
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

  const handleScoreIncrement = (increment) => {
    // Update the leaderboard with the new increment
    setLeaderboard((prevLeaderboard) =>
      prevLeaderboard.map((user) => {
        if (user._id === socket.id) { // Assuming socket.id is the user ID
          return { ...user, score: user.score + increment };
        }
        return user;
      })
    );
  };

  return (
    <div className="dashboard-container">
      <h2>BBQ & Beer Tracker</h2>
      <CapturePhoto onScoreIncrement={handleScoreIncrement} /> {/* Include the CapturePhoto component */}
      
      <ul>
        {leaderboard.map((user) => (
          <li key={user._id}>{user.username}: {user.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
