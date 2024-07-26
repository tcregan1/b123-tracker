// src/components/IncrementScore.js

import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../AuthContext'; // Ensure correct import

const socket = io('https://beer-tracker-backend.onrender.com'); // Ensure this matches the backend URL

const IncrementScore = () => {
  const { authState } = useAuth();
  const [increment, setIncrement] = useState(1);
  const [error, setError] = useState(null);

  const handleIncrementChange = (e) => {
    setIncrement(Number(e.target.value));
  };

  const incrementScore = async () => {
    try {
      // Emit score increment event
      socket.emit('incrementScore', increment);

      // Update the score via API
      await axios.post(
        'https://beer-tracker-backend.onrender.com/api/increment-score',
        { increment },
        {
          headers: {
            Authorization: `Bearer ${authState.token}` // Use the actual JWT token
          }
        }
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Error incrementing score');
    }
  };

  return (
    <div>
      <h3>Increment Score</h3>
      <input
        type="number"
        value={increment}
        onChange={handleIncrementChange}
        min="1"
      />
      <button onClick={incrementScore}>Increment Score</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default IncrementScore;
