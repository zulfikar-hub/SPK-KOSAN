import React, { FC } from "react";

interface SliderProps {
  value: number[]; // ← array
  onValueChange: (value: number[]) => void; // ← array
  max?: number;
  step?: number;
  className?: string;
}

const Slider: FC<SliderProps> = ({ value, onValueChange, max = 100, step = 1, className }) => {
  return (
    <input
      type="range"
      className={`w-full ${className || ""}`}
      value={value[0]} // ambil elemen pertama
      max={max}
      step={step}
      onChange={(e) => onValueChange([Number(e.target.value)])} // kembalikan array
    />
  );
};

export default Slider;
