import { Socket } from 'socket.io';
import { adminAuth } from '../config/firebase';

export interface AuthenticatedSocket extends Socket {
  user?: any; // The decoded Firebase Auth token
  roomId?: string; // The stream room they have joined
  isStreamer?: boolean; // True if they are the owner of the room
}

// Middleware to verify Firebase ID tokens for socket connections
export const socketAuthMiddleware = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    socket.user = decodedToken;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
};
