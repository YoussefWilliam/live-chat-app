import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
const Room = () => {
  const { id: roomId } = useParams();
  const { webSocketClient } = useContext(RoomContext);

  useEffect(() => {
    webSocketClient.emit("join-room", { roomId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);
  return <div>Room {roomId}</div>;
};

export default Room;
