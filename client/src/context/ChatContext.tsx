import React, { createContext, useEffect, useReducer } from "react";
import { addHistoryAction, addMessageAction } from "../reducers/chatActions";
import { chatReducer, ChatState } from "../reducers/chatReducer";
import { IMessage } from "../types/chat";
import { webSocketClient } from "../webSocket";

interface ChatValue {
  chat: ChatState;
  sendMessage: (
    message: string,
    userId: string,
    userName: string,
    roomId: string
  ) => void;
}

export const ChatContext = createContext<ChatValue>({
  chat: {
    messages: [],
  },
  sendMessage: () => {},
});

export const ChatProvider: React.FC<any> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, { messages: [] });

  const sendMessage = (
    message: string,
    userId: string,
    userName: string,
    roomId: string
  ) => {
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
    chatDispatch(addMessageAction(message));
  };

  const handleMessageHistory = (messages: Array<IMessage>) => {
    chatDispatch(addHistoryAction(messages));
  };

  useEffect(() => {
    webSocketClient.on("add-message", handleAddMessage);
    webSocketClient.on("get-messages", (messages) =>
      handleMessageHistory(messages)
    );

    return () => {
      webSocketClient.off("add-message");
      webSocketClient.off("get-messages");
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
