import { Server } from 'socket.io';
import { AuthenticatedSocket, socketAuthMiddleware } from './auth';
import { db } from '../config/firebase';
import { OBSCommandMessage } from 'shared';

export const setupSocketHandlers = (io: Server) => {
  // Use Firebase Auth middleware
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.uid}`);

    // Join a room (either as a streamer/bridge or as a moderator)
    socket.on('joinRoom', async (roomId: string, callback: (res: { success: boolean, message?: string }) => void) => {
      try {
        // Validate if the user is authorized to join this room
        // Room ID is typically the Streamer's UID, or a dedicated room ID stored on the user doc
        const querySnapshot = await db.collection('users').where('streamerRoomId', '==', roomId).get();
        
        if (querySnapshot.empty) {
          return callback({ success: false, message: 'Room not found' });
        }

        const streamerDoc = querySnapshot.docs[0];
        const streamerData = streamerDoc.data();
        const uid = socket.user?.uid;

        const isStreamer = streamerDoc.id === uid;
        const isModerator = streamerData.moderators && streamerData.moderators.includes(uid);

        if (!isStreamer && !isModerator) {
          return callback({ success: false, message: 'Unauthorized to join this room' });
        }

        socket.join(roomId);
        socket.roomId = roomId;
        socket.isStreamer = isStreamer;

        // If the streamer is joining, they act as the Bridge.
        if (isStreamer) {
          socket.to(roomId).emit('bridgeConnected');
          console.log(`Bridge connected for room ${roomId}`);
        }

        callback({ success: true });
        console.log(`User ${uid} joined room ${roomId}`);

      } catch (error: any) {
        console.error('Error joining room:', error);
        callback({ success: false, message: 'Internal server error' });
      }
    });

    // Moderator sends a command to the Bridge
    socket.on('obsCommand', (data: OBSCommandMessage) => {
      if (!socket.roomId) return;
      
      // Relay the command to everyone in the room (only the Bridge should act on it)
      // Alternatively, we could specifically target the Bridge socket if tracked
      io.to(socket.roomId).emit('executeObsCommand', data);
      console.log(`Command ${data.action} relayed in room ${socket.roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.uid}`);
      if (socket.isStreamer && socket.roomId) {
        socket.to(socket.roomId).emit('bridgeDisconnected');
      }
    });
  });
};
