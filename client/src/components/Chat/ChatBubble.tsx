import React, { useContext } from "react";
import { IMessage } from "../../types/chat";
import cx from "classnames";
import { UserContext } from "../../context/UserContext";

const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
  const { userId } = useContext(UserContext);
  const isMeTheSender = userId === message.author;

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
