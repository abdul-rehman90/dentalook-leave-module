import React from 'react'

function Button({ bgcolor, border, text, textcolor, type, onClick, className, href }) {
    return (
        <button
            type={type}
            href={href}
            onClick={onClick}
            className={`py-[6px] md:py-[11px] rounded-xl text-base font-medium px-[75px] cursor-pointer 
                ${className ? className : ''}
        ${bgcolor ? 'bg-[#335679]' : 'bg-transparent'}
        ${border ? 'border border-[#D0D5DD]' : 'border-0'}
        ${textcolor ? 'text-[#335679]' : ' text-white'} 
        `}
        >
            {text}
        </button>
    )
}

export default Button