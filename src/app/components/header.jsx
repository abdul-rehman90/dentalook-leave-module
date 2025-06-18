'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BellNotification, userAvatar } from '../../common/assets/images'
import Sidebar from './sidebar'
import { usePathname } from 'next/navigation'

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

    useEffect(() => {
        if (pathname === '/select-role' || pathname === '/') {
        }
    }, [pathname])

    if (pathname === '/select-role' || pathname === '/') return null;


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
                        <Image height={40} width={40} src={userAvatar} alt='avatar' />
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
