'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from '../../../common/assets/icons';

const CustomSelector = ({
  options = [],
  onChange,
  label,
  placeholder = 'Select an option',
  selectorstyle,
  labelKey = 'label',
  valueKey = 'value',
  value,
  disabled = false,
  className = '',
  showSearch = false,
  handleClick,
  labelClassName = '',
  onOpen,
  // Optional: force display text when selected option isn't in options yet
  displayLabel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const selectorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const selected =
    options?.find((option) => option[valueKey] === value) || null;

  const showDotIndicator =
    selected && (selected[valueKey] === 'yes' || selected[valueKey] === 'no');
  const dotColor = selected?.value === 'yes' ? 'bg-red-600' : 'bg-orange-400';

  const handleSelect = (option) => {
    if (disabled) return;
    onChange(option[valueKey], option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredOptions = showSearch
    ? options.filter((option) =>
        String(option[labelKey] || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    if (!isOpen) {
      onOpen && onOpen();
    }
    setIsOpen(!isOpen);
    handleClick && handleClick();
  };

  return (
    <div
      ref={selectorRef}
      className="relative w-full flex flex-col gap-2 custom__class"
    >
      {label && (
        <label
          className={`text-[11px] text-[#373940] font-semibold ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="w-full">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={`${className} w-full bg-white flex items-center justify-between border border-[#D9DADF] rounded-[8px] px-4 py-1.5 text-sm font-medium focus:outline-none text-[#1F1F1F] ${
            selectorstyle || ''
          }`}
        >
          {showDotIndicator && (
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          )}
          <span className="text-[#000]">
            {selected ? selected[labelKey] : displayLabel || placeholder}
          </span>
          <ChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            size={18}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto text-sm">
            {/* Search bar only if showSearch is true */}
            {showSearch && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelect(option)}
                  >
                    {option[labelKey]}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelector;
