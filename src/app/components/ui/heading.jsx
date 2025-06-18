import React from 'react'

const Heading = ({ title, subtitle, className = '', titleClass = '', subtitleClass = '' }) => {
    return (
        <div className={`${className}`}>
            <h2 className={`transition-colors duration-300 ${titleClass || 'text-lg md:text-xl font-semibold text-[#030303]'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-1 text-sm transition-colors duration-300 ${subtitleClass || 'text-[#335679]'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}

export default Heading
