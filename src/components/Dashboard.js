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
  const [photoUploaded, setPhotoUploaded] = useState(false);

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

  const handlePhotoUploadSuccess = () => {
    setPhotoUploaded(true); // Trigger score increment on successful photo upload
  };

  return (
    <div>
      <h2>BBQ Beer Tracker</h2>
      <IncrementScore onPhotoUploadSuccess={handlePhotoUploadSuccess} />
      <CapturePhoto onUploadSuccess={handlePhotoUploadSuccess} />
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
