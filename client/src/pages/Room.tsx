import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";
import { RoomContext } from "../context/RoomContext";
const Room = () => {
  const { id: roomId } = useParams();
  const { webSocketClient, currentPeer, stream, peers } =
    useContext(RoomContext);

  useEffect(() => {
    if (currentPeer) {
      webSocketClient.emit("join-room", { roomId, peerId: currentPeer._id });
    }
  }, [roomId, currentPeer, webSocketClient]);
  return (
    <div>
      <div>Room {roomId}</div>
      <div className="grid grid-cols-4 gap4">
        <VideoPlayer stream={stream} />
        {Object.values(peers as PeerState).map((peer) => (
          <VideoPlayer stream={peer.stream} />
        ))}
      </div>
    </div>
  );
};

export default Room;
