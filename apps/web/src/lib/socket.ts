import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    // Determine the server URL based on environment or fallback to localhost
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    socket = io(serverUrl, {
      auth: { token },
      autoConnect: false,
    });
  } else if (token) {
    socket.auth = { token };
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
