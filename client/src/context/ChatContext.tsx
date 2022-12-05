import { createContext, useContext, useEffect, useReducer } from "react";
import { addHistoryAction, addMessageAction } from "../reducers/chatActions";
import { chatReducer, ChatState } from "../reducers/chatReducer";
import { IMessage } from "../types/chat";
import { webSocketClient } from "../webSocketClient";
import { UserContext } from "./UserContext";

interface ChatContextProps {
  chat: ChatState;
  sendMessage: (message: string, roomId: string) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  chat: {
    messages: [],
  },
  sendMessage: () => {},
});

export const ChatProvider: React.FC<any> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, { messages: [] });
  const { userId, userName } = useContext(UserContext);

  const sendMessage = (message: string, roomId: string) => {
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
    webSocketClient.on("add-message", handleAddMessage);
    webSocketClient.on("get-messages", (messages) => {
      handleMessageHistory(messages);
      console.log("messssaaaggessss", messages);
    });
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
