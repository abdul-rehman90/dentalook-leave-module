import React from "react";

function Input({ label, id, type, placeholder, value, onChange,name, className, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[11px] text-[#373940] font-bold" htmlFor={id}>
        {label}
      </label>}
      <input
        className={`${className && className} py-[8px] bg-white text-[#000] px-4 placeholder:text-[#1f1f1fa9] focus:outline-0 text-sm rounded-[8px] border border-[#D9DADF]`}
        id={id}
        type={type}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        value={value}
        {...props}
      />
    </div>
  );
}

export default Input;
