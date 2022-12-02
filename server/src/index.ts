import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = 8080;
const app = express();
app.use(cors());
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🥳User is now connected 🥳");

  socket.on("disconnect", () => {
    console.log("🥺 User is disconnected 🥺");
  });
});

httpServer.listen(port, () => {
  console.log("🚀 Listining on port", port, "🚀");
});
