import React from "react";

const Header: React.FC = () => {
  return (
    <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
      <div className="text-center  py-20 px-6">
        <h1 className="text-5xl font-bold mt-0 mb-6">Welcome to Live Chat</h1>
        <h3 className="text-3xl font-bold mb-8">
          Please enter your name and select either join room, or create a new
          one
        </h3>
      </div>
    </div>
  );
};

export default Header;
