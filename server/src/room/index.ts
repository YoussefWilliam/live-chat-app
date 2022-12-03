import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import { IJoinRoomParams, IMessage, IRoomParams, IUser } from "./types";

const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.join(roomId);
    socket.emit("room-created", { roomId });
    console.log("👍 User created a room 👍");
  };

  const joinRoom = ({ roomId, peerId, userName }: IJoinRoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    console.log(`👀 User ${userName} of id ${peerId} joined room ${roomId} 👀`);
    rooms[roomId][peerId] = { peerId, userName };
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { peerId, userName });
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      console.log(`👀 User ${peerId} left room ${roomId} 👀`);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    // rooms[roomId] = rooms[roomId]?.filter((id) => id != peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const sendMessage = (roomId: string, message: IMessage) => {
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("send-message", sendMessage);
};
