'use client'
import React, { useEffect } from 'react'
import { Mainlogo } from '../../common/assets/images'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Home, Mail, Profile } from '../../common/assets/icons'
// import Settings from '../../../common/assets/icons/settings'
// import Logout from '../../../common/assets/icons/logout'
import { usePathname } from 'next/navigation'
import path from 'path'

function Sidebar({ isSidebarOpen = false, onClose = () => { } }) {
    const pathname = usePathname()

    const sidebarData = [
        { SideIcon: Home, sideLink: '/view-request', Sideitem: 'Dashboard' },
        // { SideIcon: Calendar, sideLink: '/calendar', Sideitem: 'Calendar' },
        // { SideIcon: Mail, sideLink: '/reports', Sideitem: 'Reports' },
        { SideIcon: Profile, sideLink: '/leave-request', Sideitem: 'Leave Request' },
    ]

    const logout = [
        // { SideIcon: Settings, sideLink: '#', Sideitem: 'Settings' },
        // { SideIcon: Logout, sideLink: '/', Sideitem: 'Logout' },
    ]

    useEffect(() => {
        if (pathname === '/select-role' || pathname === '/') {
            // console.log('Do something OR return early 💅');
        }
    }, [pathname])

    if (pathname === '/select-role' || pathname === '/' || pathname === '/forgot-password') return null;
   
    return (
        <>
            {/* 👉 Mobile overlay */}
            {isSidebarOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden"
                />
            )}

            <div
                className={`
                    fixed z-[9999] md:sticky md:block top-0 
                    w-[272px] bg-white border border-[#F3F3F5] px-6 h-full min-h-screen rounded-tr-[24px] 
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}
            >
                <div className="py-8">
                    <Link href="/">
                        <Image src={Mainlogo} alt="main logo" />
                    </Link>
                </div>

                <div className="flex flex-col justify-between gap-4 h-[calc(100vh-109px)]">
                    <div>
                        
                        <div className="flex flex-col gap-2">
                            {sidebarData.map((items, index) => (
                                <Link
                                    key={index}
                                    href={items.sideLink}
                                    onClick={() => {
                                        onClose();
                                         if (items.sideLink === '/leave-request') {
                                            localStorage.removeItem("leaveRequestId");
                                        }
                                    }}
                                    className="flex items-center mt-2"
                                >
                                    <div
                                        className={`px-3 py-2.5 ${pathname === items.sideLink
                                            ? 'bg-[#00465F] text-white rounded-xl'
                                            : 'text-[#373940]'
                                            }`}
                                    >
                                        {items.SideIcon && (
                                            <items.SideIcon
                                                className={
                                                    pathname === items.sideLink
                                                        ? 'text-primary'
                                                        : 'text-[#373940]'
                                                }
                                            />
                                        )}
                                    </div>
                                    <p
                                        className={`text-sm w-full font-normal py-2.5 px-3 font-jakarta ${pathname === items.sideLink
                                            ? 'bg-[#00465F] text-white rounded-xl'
                                            : 'text-[#373940]'
                                            }`}
                                    >
                                        {items.Sideitem}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 ms-2">
                        {logout.map((items, index) => (
                            <Link
                                key={index}
                                href={items.sideLink}
                                className="flex items-center gap-5.5 py-2.5 mt-2"
                            >
                                {items.SideIcon && <items.SideIcon />}
                                <p className="text-sm font-normal text-[#373940] font-jakarta">
                                    {items.Sideitem}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
