import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";

import { IMessage } from "../../types/chat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatScreen: React.FC = () => {
  const { chat } = useContext(ChatContext);

  const myLastMessageRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    myLastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="flex w-full flex-col h-[800px] justify-between pb-20">
      <div className="overflow-y-scroll max-h-[800px]" id="chat-screen">
        {chat.messages.map((message: IMessage, i: number) => (
          <ChatBubble key={i} message={message} />
        ))}
        <div ref={myLastMessageRef} id="lastMessageRef" />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatScreen;
