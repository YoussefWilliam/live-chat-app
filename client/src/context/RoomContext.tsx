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
  addPeerAction,
  addPeerNameAction,
  removePeerAction,
} from "../reducers/peerActions";
import { IMessage } from "../types/chat";
import { chatReducer } from "../reducers/chatReducer";
import { addHistoryAction, addMessageAction } from "../reducers/chatActions";
import { UserContext } from "./UserContext";

const WEB_SOCKET = "http://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const webSocketClient = socketIOClient(WEB_SOCKET);

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

  const handleGetUsers = ({
    participants,
  }: {
    participants: Array<string>;
  }) => {
    console.log({ participants });
  };

  const handleRemovePeers = (peerId: string) => {
    peerDispatch(removePeerAction(peerId));
  };

  const sendMessage = (message: string) => {
    const messageData: IMessage = {
      content: message,
      author: userId,
      timestamp: new Date().getTime().toString(),
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

  useEffect(() => {}, []);

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
    webSocketClient.on("get-users", handleGetUsers);
    webSocketClient.on("user-disconnected", handleRemovePeers);
    webSocketClient.on("add-message", handleAddMessage);
    webSocketClient.on("get-messages", (messages) =>
      handleMessageHistory(messages)
    );

    return () => {
      webSocketClient.off("room-created");
      webSocketClient.off("get-users");
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
      peerDispatch(addPeerNameAction(peerId, name));
      const call = currentPeer.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        peerDispatch(addPeerAction(peerId, peerStream));
      });
    });

    // Accepting the call by receiving other streams.
    currentPeer.on("call", (call) => {
      const { userName: peerUserName } = call.metadata;
      peerDispatch(addPeerNameAction(call.peer, peerUserName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        peerDispatch(addPeerAction(call.peer, peerStream));
      });
    });
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
