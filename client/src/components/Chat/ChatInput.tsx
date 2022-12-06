import React, { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import SendIcon from "./SendIcon";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<string>();
  const { sendMessage } = useContext(RoomContext);

  const handleOnSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message?.length) {
      sendMessage(message);
      setMessage("");
    }
  };
  return (
    <div className="block w-full">
      <form onSubmit={(e) => handleOnSend(e)}>
        <div className="flex flex-row px-2 fixed bottom-0 w-1/3">
          <input
            autoFocus
            type="text"
            id="name"
            value={message}
            autoComplete="do-not-autofill"
            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="p-4">
            <SendIcon shouldSend={!!message} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
