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
        "m-2 flex",
        isMeTheSender ? "justify-end pr-2" : "justify-start pl-2"
      )}
    >
      <div>
        {message.name}
        <div
          className={cx(
            "p-3",
            isMeTheSender
              ? "rounded-l-lg rounded-tr-lg bg-green-700"
              : "rounded-r-lg rounded-bl-lg bg-gray-500"
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs leading-none text-gray-300">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
