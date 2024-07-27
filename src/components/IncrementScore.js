// src/components/IncrementScore.js

import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../AuthContext'; // Ensure correct import

const socket = io('https://beer-tracker-backend.onrender.com'); // Ensure this matches the backend URL

const IncrementScore = ({ onPhotoUploadSuccess }) => {
  const { authState } = useAuth();
  const [selectedOption, setSelectedOption] = useState('Beer');
  const [error, setError] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const incrementScore = async () => {
    let increment;
    switch (selectedOption) {
      case 'Shot':
        increment = 1;
        break;
      case 'Double':
        increment = 2;
        break;
      default: // 'Beer'
        increment = 1;
    }

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
      onPhotoUploadSuccess(); // Call callback after successful score increment
    } catch (err) {
      setError(err.response?.data?.message || 'Error incrementing score');
    }
  };

  return (
    <div>
      <h3>Increment Score</h3>
      <div>
        <label htmlFor="scoreOption">Choose your increment:</label>
        <select id="scoreOption" value={selectedOption} onChange={handleOptionChange}>
          <option value="Beer">Beer (1 Point)</option>
          <option value="Shot">Shot (1 Point)</option>
          <option value="Double">Double (2 Points)</option>
        </select>
      </div>
      <button onClick={incrementScore}>Increment Score</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default IncrementScore;
