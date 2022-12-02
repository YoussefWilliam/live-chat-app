import React, { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peerReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WEB_SOCKET = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const webSocketClient = socketIOClient(WEB_SOCKET);

export const RoomProvider: React.FunctionComponent<any> = ({ children }) => {
  const navigate = useNavigate();
  const [currentPeer, setCurrentPeer] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});

  const handleEnterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
    console.log("here is my id:::", roomId);
  };

  const getUsers = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: Array<string>;
  }) => {
    console.log({ participants });
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const currentPeerId = uuidV4();
    const peer = new Peer(currentPeerId);
    setCurrentPeer(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.log(error);
    }

    webSocketClient.on("room-created", handleEnterRoom);
    webSocketClient.on("get-users", getUsers);
    webSocketClient.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    if (!currentPeer) return;
    if (!stream) return;

    // Initiaiting the call by sending our stream.
    webSocketClient.on("user-joined", ({ peerId }) => {
      const call = currentPeer.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    // Accepting the call by receiving other streams.
    currentPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [currentPeer, stream]);

  console.log({ peers });

  return (
    <RoomContext.Provider
      value={{ webSocketClient, currentPeer, stream, peers }}
    >
      {children}
    </RoomContext.Provider>
  );
};
