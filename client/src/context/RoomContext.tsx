import React, {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peerReducer } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerAction,
} from "../reducers/peerActions";
import { UserContext } from "./UserContext";
import { webSocketClient } from "../webSocket";

export const RoomContext = createContext<null | any>(null);

export const RoomProvider: React.FunctionComponent<any> = ({ children }) => {
  const navigate = useNavigate();
  const [currentPeer, setCurrentPeer] = useState<Peer>();
  const { userName } = useContext(UserContext);
  const [stream, setStream] = useState<MediaStream>();
  const [peers, peerDispatch] = useReducer(peerReducer, {});
  const [roomId, setRoomId] = useState<string>("");

  const handleEnterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };

  const handleRemovePeers = (peerId: string) => {
    peerDispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const randomPeerId = uuidV4();
    const currentId = localStorage.getItem("userId") || randomPeerId;
    const peer = new Peer(randomPeerId);
    setCurrentPeer(peer);
    localStorage.setItem("userId", currentId);

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
    webSocketClient.on("user-disconnected", handleRemovePeers);

    return () => {
      webSocketClient.off("room-created");
      webSocketClient.off("user-disconnected");
      webSocketClient.off("user-joined");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentPeer) return;
    if (!stream) return;

    // Initiaiting the call by sending our stream.
    webSocketClient.on("user-joined", ({ peerId, userName: name }) => {
      const call = currentPeer.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        peerDispatch(addPeerStreamAction(peerId, peerStream));
      });
      peerDispatch(addPeerNameAction(peerId, name));
    });

    // Accepting the call by receiving other streams.
    currentPeer.on("call", (call) => {
      const { userName } = call.metadata;
      peerDispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        peerDispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      webSocketClient.off("user-joined");
    };
  }, [currentPeer, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        webSocketClient,
        currentPeer,
        stream,
        peers,
        setRoomId,
        roomId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
