
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from '../../../common/assets/icons';

const CustomSelector = ({ options, onChange, label, placeholder = 'Select an option', selectorstyle }) => {
    const [selected, setSelected] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [leaveType, setLeaveType] = useState('');
    const selectorRef = useRef(null);

    const handleSelect = (value) => {
        setSelected(value);
        onChange(value);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectorRef} className="relative w-full flex flex-col gap-2">
            <label className='text-[13px] font-medium text-[#373940]' htmlFor="">{label}</label>
            <div className='w-full'>
                <button
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between bg-transparent border border-[#D9DADF] rounded-xl px-4 py-2 text-sm font-medium focus:outline-none text-[#1F1F1F] focus:ring-0 ${selectorstyle ? selectorstyle : ''}`}
                >
                    <span className='text-[#1f1f1fa9]'>{selected || placeholder}</span>
                    <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={18} />
                </button>

                {isOpen && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto text-sm">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => {
                                    handleSelect(option);
                                    setIsOpen(false)
                                }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div >
    );
};

export default CustomSelector;
