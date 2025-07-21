import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  return io;
}
export function getIO(): Server {
  if(!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
