import React from 'react'

function Button({ bgcolor, border, text, textcolor, type, onClick, className, name, href, ...props }) {
    return (
        <button
            type={type}
            href={href}
            {...props}
            onClick={onClick}
            name={name}
            className={`py-[6px] md:py-[11px] rounded-xl text-base font-medium px-[75px] cursor-pointer 
                ${className ? className : ''}
        ${bgcolor ? 'bg-[#335679]' : 'bg-transparent'}
        ${border ? 'border border-[#D0D5DD]' : 'border-0'}
        ${textcolor ? 'text-[#335679]' : ' text-white'} 
        `
        
    }
        >
            {text}
        </button>
    )
}

export default Button