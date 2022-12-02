import React, { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import Button from "../Button";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<string>();
  const { sendMessage } = useContext(RoomContext);
  const handleOnSend = () => {
    sendMessage(message);
    setMessage("");
  };
  return (
    <div className="flex flex-col">
      <form>
        <input
          type="text"
          id="name"
          value={message}
          autoComplete="do-not-autofill"
          className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="py-4">
          <Button
            text="Send"
            disabled={!message}
            handleOnClick={handleOnSend}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
