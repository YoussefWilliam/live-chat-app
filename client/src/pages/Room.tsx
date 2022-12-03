import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatScreen from "../components/Chat/ChatScreen";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import UserName from "../components/UserName";
import { UserContext } from "../context/UserContext";
const Room = () => {
  const { id: roomId } = useParams();
  const { userName } = useContext(UserContext);
  const { webSocketClient, currentPeer, stream, peers, setRoomId } =
    useContext(RoomContext);
  console.log("🚀 ~ file: Room.tsx:13 ~ Room ~ peers", peers);

  useEffect(() => {
    if (currentPeer) {
      webSocketClient.emit("join-room", { roomId, peerId: currentPeer._id });
    }
  }, [roomId, currentPeer, webSocketClient]);

  useEffect(() => {
    setRoomId(roomId || "");
  }, [roomId, setRoomId]);

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="text-center border-b">
        <h1 className="text-xl font-bold mt-0 mb-6">🚀Welcome to the room🚀</h1>
        <h3 className="text-white font-bold">{roomId}</h3>
      </div>
      <div className="flex grow">
        <div className="grow w-2/3 grid gap-3 grid-cols-3">
          <div>
            <VideoPlayer stream={stream} />
            <UserName name={userName} isMeTheSender={true} />
          </div>

          {Object.values(peers as PeerState).map((peer) => (
            <div>
              <VideoPlayer stream={peer.stream} />
              <UserName name={peer.userName} isMeTheSender={false} />
            </div>
          ))}
        </div>
        <div className="grow w-1/3 border-l-2 pb-28">
          <ChatScreen />
        </div>
      </div>
    </div>
  );
};

export default Room;
