// src/SocketProvider.js
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // Adjust the URL if needed
    setSocket(newSocket);

    newSocket.on('leaderboardUpdate', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, leaderboard }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
