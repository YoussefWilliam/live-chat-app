import React, { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";

import { IMessage } from "../../types/chat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatScreen: React.FC = () => {
  const { chat } = useContext(RoomContext);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {chat.messages.map((message: IMessage, i: number) => (
          <ChatBubble key={i} message={message} />
        ))}
      </div>
      <div className="place-content-end">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatScreen;
