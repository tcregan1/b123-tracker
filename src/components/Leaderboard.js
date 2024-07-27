// src/components/Leaderboard.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles.css'; // Ensure the path is correct for your CSS file
import toastBeerImage from '../Images/toastBeer-removebg-preview.png'; // Import the image

const socket = io('https://beer-tracker-backend.onrender.com'); // Ensure this matches your backend URL

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch initial leaderboard
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://beer-tracker-backend.onrender.com/api/leaderboard');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setLeaders(data);
      } catch (error) {
        setError('Error fetching leaderboard');
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();

    // Listen for real-time updates
    socket.on('leaderboardUpdate', (data) => {
      setLeaders(data);
    });

    // Clean up socket on component unmount
    return () => {
      socket.off('leaderboardUpdate');
    };
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="title-container">
        <img src={toastBeerImage} alt="Cheers" className="title-image" /> {/* Left image */}
        <h1 className="leaderboard-title">Leaderboard</h1>
        <img src={toastBeerImage} alt="Cheers" className="title-image" /> {/* Right image */}
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="leaderboard-list">
        {leaders.map((user, index) => (
          <li key={user._id} className="leaderboard-item">
            <span className="position">{index + 1}</span>
            <span className="leaderboard-name">{user.username}</span>: {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
