import React, { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { IMessage } from "../../types/chat";
import cx from "classnames";

const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
  const { currentPeer } = useContext(RoomContext);
  const isMeTheSender = currentPeer?.id === message.author;
  return (
    <div
      className={cx(
        "m-2 flex pl-10",
        isMeTheSender ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cx(
          "inline-block py-2 px-4 rounded",
          isMeTheSender ? "bg-green-700" : "bg-gray-500"
        )}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatBubble;
