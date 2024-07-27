// src/components/CapturePhoto.js

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Ensure correct import

const CapturePhoto = ({ onUploadSuccess }) => {
  const { authState } = useAuth();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadPhoto = async () => {
    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(
        'https://beer-tracker-backend.onrender.com/api/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`, // Use the actual JWT token
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setError(null);
      setFile(null);
      onUploadSuccess(); // Notify parent component about successful upload
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading photo');
    }
  };

  return (
    <div>
      <h3>Capture Photo</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadPhoto}>Upload Photo</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CapturePhoto;
