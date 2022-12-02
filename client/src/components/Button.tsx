import React from "react";

interface IButtonProps {
  handleOnClick: () => void;
  disabled: boolean;
  text: string;
}
const Button: React.FC<IButtonProps> = ({ handleOnClick, disabled, text }) => {
  return (
    <div className="flex space-x-2 justify-center">
      <button
        onClick={(e) => {
          e.preventDefault();
          handleOnClick();
        }}
        type="submit"
        disabled={disabled}
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-600"
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
