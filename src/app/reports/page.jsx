import React from 'react';
import Link from 'next/link'; // or 'next/link' if using Next.js

const NotFound = () => {
    return (
        <div className="h-[calc(100vh-200px)] w-full flex flex-col justify-center items-center bg-transparent px-6 text-center">
            <h1 className="text-[120px] font-extrabold text-[#335679] leading-none">Reports</h1>
            {/* <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Oops! Page not found
            </p>
            <p className="text-gray-500 mb-6">
                The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link
                href='/dashboard'
                className="inline-block px-6 py-3 text-sm font-medium text-white bg-[#335679] rounded-lg  transition duration-300"
            >
                Dashboard
            </Link> */}
        </div>
    );
};

export default NotFound;
