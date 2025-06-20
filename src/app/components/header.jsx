'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { BellNotification, userAvatar } from '../../common/assets/images'
import Sidebar from './sidebar'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Router } from 'next/router'

function Header() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto'
    }, [isSidebarOpen])
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();


    const handleLogout = () => {
        router.push('/')
        setOpen(false);
    };


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        if (pathname === '/select-role' || pathname === '/') {
        }
    }, [pathname])

    if (pathname === '/select-role' || pathname === '/' || pathname === '/forgot-password') return null;


    return (
        <>
            <div className='block md:hidden'>
                <Sidebar isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>

            <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-0 px-0 md:px-6' : 'py-0 md:py-6 px-0 md:px-6'}`}>
                <div className={`bg-white px-6 py-3 flex items-center justify-between w-full ${isScrolled ? 'shadow rounded-t-0 rounded-b-2xl' : 'rounded-2xl'}`}>
                    <Link href='/' className='font-bold text-lg hidden md:block'>
                        Submit Provider Leave Request
                    </Link>

                    <button onClick={() => setIsSidebarOpen(true)} className='text-xl font-bold md:hidden'>
                        ☰
                    </button>

                    <div className='flex items-center gap-3'>
                        {/* <Image height={40} width={40} src={BellNotification} alt='bell icon' /> */}
                        <div ref={dropdownRef} className="relative inline-block text-left">
                            <div
                                className="cursor-pointer select-none"
                                onClick={() => setOpen((prev) => !prev)}
                            >
                                <Image
                                    height={40}
                                    width={40}
                                    src={userAvatar}
                                    alt="avatar"
                                    className="rounded-full border"
                                />

                            </div>

                            {open && (
                                <div className="absolute right-0 mt-2 w-40 bg-[#030E25] border border-[#041432] rounded-lg shadow-md z-20 overflow-hidden">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-[#CECFD2] hover:bg-[#041432] transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className='hidden md:flex flex-col'>
                            <p className='text-sm font-bold'>Olivia Ryne</p>
                            <p className='text-sm'>oliviryneee@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
