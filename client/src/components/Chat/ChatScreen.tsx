import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

import { IMessage } from "../../types/chat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatScreen: React.FC = () => {
  const { chat } = useContext(ChatContext);
  console.log("🚀 ~ file: ChatScreen.tsx:10 ~ chat", chat);

  return (
    <div className="flex flex-col h-full justify-between pb-20">
      <div className="overflow-y-scroll max-h-[800px]">
        {chat.messages.map((message: IMessage, i: number) => (
          <ChatBubble key={i} message={message} />
        ))}
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatScreen;
