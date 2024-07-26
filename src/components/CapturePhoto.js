import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Adjust import if necessary

const CapturePhoto = () => {
  const { authState } = useAuth();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the selected file
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a photo');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Use the JWT token from AuthContext
      await axios.post('https://beer-tracker-backend.onrender.com/api/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authState.token}`, // Use the actual JWT token
        },
      });
      alert('Photo uploaded successfully');
    } catch (err) {
      setError('Error uploading photo');
      console.error('Error uploading photo:', err);
    }
  };

  return (
    <div>
      <h3>Capture Photo</h3>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Use the rear camera for capturing a photo
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload Photo</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CapturePhoto;
