import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket/handlers';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for the micro-saas
    methods: ['GET', 'POST'],
  },
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
