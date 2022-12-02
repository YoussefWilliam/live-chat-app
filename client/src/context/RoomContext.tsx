import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
const WEB_SOCKET = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const webSocketClient = socketIOClient(WEB_SOCKET);

export const RoomProvider: React.FunctionComponent<any> = ({ children }) => {
  const navigate = useNavigate();
  const handleEnterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
    console.log("here is my id:::", roomId);
  };
  useEffect(() => {
    webSocketClient.on("room-created", handleEnterRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RoomContext.Provider value={{ webSocketClient }}>
      {children}
    </RoomContext.Provider>
  );
};
