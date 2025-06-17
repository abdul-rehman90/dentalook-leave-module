import React from 'react'

function Input({ label, id, type, placeholder }) {
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-[13px] text-[#373940] font-medium' htmlFor={id}>
                {label}
            </label>
            <input
                className='py-[8px] px-4 text-[#1F1F1F] placeholder:text-[#1F1F1F] focus:outline-0 text-sm rounded-xl border border-[#D9DADF]'
                id={id} type={type} placeholder={placeholder} />
        </div>
    )
}

export default Input