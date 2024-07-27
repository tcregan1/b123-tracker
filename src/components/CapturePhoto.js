// src/components/CapturePhoto.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Ensure correct import

const CapturePhoto = ({ onScoreIncrement }) => {
  const { authState } = useAuth();
  const [selectedOption, setSelectedOption] = useState('Beer');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const fileInputRef = useRef(); // Reference to the file input

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
    setError(null); // Clear any previous errors when a new file is selected
  };

  const handleSubmit = async () => {
    if (!photo) {
      setError('Please select a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      // Upload photo
      await axios.post(
        'https://beer-tracker-backend.onrender.com/api/upload-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authState.token}` // Use the actual JWT token
          }
        }
      );

      const increment = selectedOption === 'Double' ? 2 : 1;

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

      // Trigger score increment in parent component
      onScoreIncrement(increment);

      // Clear photo and reset file input after successful upload and increment
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input value
      }

      setError(null); // Clear any previous errors
      setSuccessMessage('Keep it up!'); // Set success message
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing request');
    }
  };

  return (
    <div>
     
      <div>
        <label htmlFor="scoreOption">What are you drinking?:</label>
        <select id="scoreOption" value={selectedOption} onChange={handleOptionChange}>
          <option value="Beer">Beer (1 Point)</option>
          <option value="Shot">Shot (1 Point)</option>
          <option value="Double">Double (2 Points)</option>
        </select>
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef} // Set reference to file input
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default CapturePhoto;
