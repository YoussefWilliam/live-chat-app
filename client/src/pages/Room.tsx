import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatScreen from "../components/Chat/ChatScreen";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
const Room = () => {
  const { id: roomId } = useParams();
  const { webSocketClient, currentPeer, stream, peers, setRoomId } =
    useContext(RoomContext);

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
          <VideoPlayer stream={stream} />

          {Object.values(peers as PeerState).map((peer) => (
            <VideoPlayer stream={peer.stream} />
          ))}
        </div>
        <div className="grow w-1/3 border-l-2 pb-28">
          <ChatScreen />
        </div>
      </div>
    </div>
    // <div className="">
    //   <div className="grid grid-cols-12">
    //     <div className="col-span-9 p-2">
    //       <div className="grid grid-cols-3 gap4">

    //       </div>
    //     </div>
    //     <div className="col-span-3 border-l-2 overflow-y-auto">
    //       <ChatScreen />
    //     </div>
    //   </div>
    // </div>
  );
};

export default Room;
