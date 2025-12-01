import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-semibold text-zinc-400 ml-1">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-[#1E1E1E] text-white border border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200 placeholder-zinc-600 shadow-inner ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
