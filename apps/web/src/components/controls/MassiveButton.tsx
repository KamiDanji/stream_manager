import React from 'react';

interface MassiveButtonProps {
  label: string;
  color: string; // 'red', 'blue', 'green'
  onClick: () => void;
  disabled?: boolean;
}

export const MassiveButton: React.FC<MassiveButtonProps> = ({ label, color, onClick, disabled = false }) => {
  const colorStyles = {
    red: 'bg-red-500 active:bg-red-700 shadow-red-900/50',
    blue: 'bg-blue-500 active:bg-blue-700 shadow-blue-900/50',
    green: 'bg-green-500 active:bg-green-700 shadow-green-900/50',
  }[color] || 'bg-gray-500 active:bg-gray-700 shadow-gray-900/50';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden w-full aspect-square rounded-2xl 
        flex items-center justify-center text-white text-2xl font-bold 
        shadow-[0_8px_0_0] active:shadow-[0_0px_0_0] active:translate-y-2
        transition-all duration-100 ease-in-out select-none
        ${colorStyles}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span className="drop-shadow-md text-center px-2">{label}</span>
    </button>
  );
};
