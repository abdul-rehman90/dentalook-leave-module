import React from 'react'

function DateInput({ label }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 text-sm"
            />
        </div>
    )
}

export default DateInput