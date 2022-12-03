import React from "react";
import cx from "classnames";

const UserName: React.FC<{ name: string; isMeTheSender: boolean }> = ({
  name,
  isMeTheSender,
}) => {
  return (
    <div className="flex flex-row justify-center py-2">
      <span
        className={cx(
          "px-4 py-2 rounded-full border text-white font-semibold shadow-lg text-sm flex align-center w-max",
          isMeTheSender ? "bg-green-700" : "border-gray-500"
        )}
      >
        {name}
      </span>
    </div>
  );
};

export default UserName;
