import socketIOClient from "socket.io-client";

const webSocketURL =
  process.env.REACT_APP_WEB_SOCKET || "http://localhost:8080";
export const webSocketClient = socketIOClient(webSocketURL);
