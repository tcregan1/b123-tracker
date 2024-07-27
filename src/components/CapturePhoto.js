import React, { useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../AuthContext'; // Ensure correct import
import '../styles.css'; // Import the styles

const socket = io('https://beer-tracker-backend.onrender.com'); // Ensure this matches the backend URL

const CapturePhoto = ({ onScoreIncrement }) => {
  const { authState } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Beer');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setError('Please select a photo');
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
            Authorization: `Bearer ${authState.token}`
          }
        }
      );

      const increment = selectedOption === 'Double' ? 2 : 1;

      // Emit score increment event
      socket.emit('incrementScore', increment);

      // Update the score via API
      await axios.post(
        'https://beer-tracker-backend.onrender.com/api/increment-score',
        { increment },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
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
    <div className="dashboard-container">
      <form onSubmit={handleSubmit}>
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="Beer">Beer (1 point)</option>
          <option value="Shot">Shot (1 point)</option>
          <option value="Double">Double (2 points)</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          ref={fileInputRef}
        />
        <button type="submit">Submit</button>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
};

export default CapturePhoto;
