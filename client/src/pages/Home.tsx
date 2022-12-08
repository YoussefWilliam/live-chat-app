import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { webSocketClient } from "../webSocket";
import Header from "../components/Header";

const Home = () => {
  const { userName, setUserName } = useContext(UserContext);
  const [roomIdInput, setRoomIdInput] = useState<string>("");

  const navigate = useNavigate();

  const handleOnCreate = () => {
    webSocketClient.emit("create-room");
  };

  const handleOnJoin = () => {
    navigate(`/room/${roomIdInput}`);
  };
  return (
    <div className="h-screen">
      <div className="px-6 h-full">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <Header />
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <div className="mb-6">
              <input
                value={userName}
                type="text"
                id="name"
                autoComplete="do-not-autofill"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Ex: Steve Jobs"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <Button
              handleOnClick={handleOnCreate}
              text="Start a new room"
              disabled={!userName || !!roomIdInput}
            />
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">Or</p>
            </div>
            <h3 className="text-xl  mb-8">
              Join an existing room by adding the room id
            </h3>
            <div className="mb-6">
              <input
                onChange={(e) => setRoomIdInput(e.target.value)}
                type="text"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleFormControlInput2"
                autoComplete="do-not-autofill"
                placeholder="Ex: bed1-4156-b754-bc876fed07ea"
              />
            </div>
            <Button
              handleOnClick={handleOnJoin}
              text="Join this room"
              disabled={!userName || !roomIdInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
