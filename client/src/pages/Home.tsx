import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { webSocketClient } from "../webSocketClient";

const Home = () => {
  const { userName, setUserName } = useContext(UserContext);
  console.log("🚀 ~ file: Home.tsx:9 ~ Home ~ userName", userName);
  const [roomIdInput, setRoomIdInput] = useState<string>("");
  const navigate = useNavigate();

  const handleOnCreate = () => {
    webSocketClient.emit("create-room");
  };

  const handleOnJoin = () => {
    navigate(`/room/${roomIdInput}`);
  };
  return (
    <>
      <div className="h-screen">
        <div className="px-6 h-full">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <div className="text-center  py-20 px-6">
                <h1 className="text-5xl font-bold mt-0 mb-6">
                  Welcome to Live Chat
                </h1>
                <h3 className="text-3xl font-bold mb-8">
                  Please enter your name and select either join room, or create
                  a new one
                </h3>
              </div>
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <div className="mb-6">
                <input
                  type="text"
                  id="name"
                  value={userName}
                  autoComplete="do-not-autofill"
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Ex: Steve Jobs"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <Button
                handleOnClick={handleOnCreate}
                text="Start a new room"
                disabled={!userName}
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
    </>
  );
};

export default Home;
