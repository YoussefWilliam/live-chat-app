import React, {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peerReducer } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerAction,
} from "../reducers/peerActions";
import { IMessage } from "../types/chat";
import { chatReducer } from "../reducers/chatReducer";
import { addHistoryAction, addMessageAction } from "../reducers/chatActions";
import { UserContext } from "./UserContext";

const WEB_SOCKET = process.env.REACT_APP_WEB_SOCKET_URL;

export const RoomContext = createContext<null | any>(null);

const webSocketClient = socketIOClient(WEB_SOCKET || "");

export const RoomProvider: React.FunctionComponent<any> = ({ children }) => {
  const navigate = useNavigate();
  const [currentPeer, setCurrentPeer] = useState<Peer>();
  const { userId, userName } = useContext(UserContext);
  const [stream, setStream] = useState<MediaStream>();
  const [peers, peerDispatch] = useReducer(peerReducer, {});
  const [chat, chatDispatch] = useReducer(chatReducer, { messages: [] });
  const [roomId, setRoomId] = useState<string>("");

  const handleEnterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };

  const handleRemovePeers = (peerId: string) => {
    peerDispatch(removePeerAction(peerId));
  };

  const sendMessage = (message: string) => {
    const messageData: IMessage = {
      content: message,
      author: userId,
      name: userName,
      timestamp: new Date()
        .toTimeString()
        .split(" ")[0]
        .split(":")
        .slice(0, 2)
        .join(":"),
    };

    chatDispatch(addMessageAction(messageData));
    webSocketClient.emit("send-message", roomId, messageData);
  };

  const handleAddMessage = (message: IMessage) => {
    console.log({ message });
    chatDispatch(addMessageAction(message));
  };

  const handleMessageHistory = (messages: Array<IMessage>) => {
    chatDispatch(addHistoryAction(messages));
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
    webSocketClient.on("add-message", handleAddMessage);
    webSocketClient.on("get-messages", (messages) =>
      handleMessageHistory(messages)
    );

    return () => {
      webSocketClient.off("room-created");
      webSocketClient.off("user-disconnected");
      webSocketClient.off("user-joined");
      webSocketClient.off("add-message");
    };
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
        sendMessage,
        chat,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
