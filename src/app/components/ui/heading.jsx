import React from 'react'



const Heading = ({ title, subtitle, className = '', titleClass }) => {
    return (
        <div className={` ${className}`}>
            <h2 className={` ${titleClass ? titleClass : 'text-xl font-semibold text-[#030303]'}`}>{title}</h2>
            {subtitle && <p className="text-sm text-[#335679] mt-1">{subtitle}</p>}
        </div >
    )
}

export default Heading;
