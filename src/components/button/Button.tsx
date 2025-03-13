import React from "react";
import { ButtonProps } from "@/types/types";

export const Button: React.FC<ButtonProps> = ({
  Type,
  title,
  clickHandler,
  disabled,
}) => {
  return (
    <button
      className="w-[160px] bg-[#0066FF] text-white py-3 rounded-[25px] hover:bg-[#0052CC] transition-all duration-200 font-medium"
      onClick={clickHandler}
      type={Type}
      disabled={disabled}
    >
      {title}
    </button>
  );
};
