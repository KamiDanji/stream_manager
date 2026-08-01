import React, { useState } from 'react';

interface ThickSliderProps {
  label: string;
  initialValue?: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

export const ThickSlider: React.FC<ThickSliderProps> = ({ 
  label, 
  initialValue = 50, 
  min = 0, 
  max = 100, 
  onChange 
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setValue(val);
  };

  const handleMouseUp = () => {
    onChange(value);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-2xl w-full col-span-full shadow-inner">
      <div className="flex justify-between items-center text-white font-bold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        className="w-full h-12 bg-gray-600 rounded-full appearance-none cursor-pointer outline-none slider-thumb-fat"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${value}%, #4b5563 ${value}%)`
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        input[type=range].slider-thumb-fat::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
        input[type=range].slider-thumb-fat::-moz-range-thumb {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
          cursor: pointer;
          border: none;
        }
      `}} />
    </div>
  );
};
