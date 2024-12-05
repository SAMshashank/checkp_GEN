import { Server } from "socket.io";
import { v4 } from "uuid";

export default function setupModelSocket(
  io: Server<ClientToServerEvents, ServerToClientEvents>
) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });
    socket.on("modelData", (data:any) => {
      socket.to(data.roomId).emit("updateModel", data);
    });
    // Handle data exchange within the room
    // socket.on("sendData", ({ roomId, data }) => {
    //   socket.to(roomId).emit("receiveData", data);
    // });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });


}
