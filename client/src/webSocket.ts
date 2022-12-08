import socketIOClient from "socket.io-client";

export const webSocketClient = socketIOClient(
  process.env.REACT_APP_WEB_SOCKET_URL || ""
);
