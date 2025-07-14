"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BellNotification, userAvatar } from "../../common/assets/images";
import Sidebar from "./sidebar";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "../utils/AuthContext";
import { FaCircleUser } from "react-icons/fa6";


function Header() {
  const router = useRouter()
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const { userData } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    Cookies.remove("access-token");
    Cookies.remove("refresh-token");
    Cookies.remove("role");
    localStorage.clear();
    setOpen(false);
    console.log("Logout")
    router.replace('/');
    // window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (pathname === "/select-role" || pathname === "/") {
    }
  }, [pathname]);

  if (
    pathname === "/select-role" ||
    pathname === "/" ||
    pathname === "/forgot-password"
  )
    return null;

  return (
    <>
      <div className="block md:hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div
        className={`sticky top-0 z-[99] transition-all ${
          isScrolled ? "py-0 px-0 md:px-6" : "py-0 md:py-0 px-0 md:px-6"
        }`}
      >
        <div
          className={`bg-white px-6 py-3 flex items-center justify-between w-full ${
            isScrolled ? "shadow rounded-t-0 rounded-b-2xl" : "rounded-2xl"
          }`}
        >
          <Link href="/" className="font-bold text-lg hidden md:block">
            {
              pathname === "/reports" ? "Dental Look Leave Reports" : 
              pathname === "/view-request" ? "Leave Request Dashboard" : 
              pathname === "/leave-request" ? "Dental Look Provider Leave Request Application" : ""
            }
          </Link>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-xl font-bold md:hidden"
          >
            ☰
          </button>
          <div className="relative" ref={dropdownRef}>

            {
              userData ? 
            
              <div
                  
                  className="flex items-center gap-3 cursor-pointer "
                  onClick={() => setOpen((prev) => !prev)}
              >
                  <div  className=" inline-block text-left">
                    <div className="cursor-pointer select-none">
                        {/* <Image
                        height={40}
                        width={40}
                        src={userAvatar}
                        alt="avatar"
                        className="rounded-full border"
                        /> */}
                        <FaCircleUser className="text-[30px]" />
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col">
                    <p className="text-sm font-bold">{userData.name}</p>
                    <p className="text-sm">{userData.email}</p>
                  </div>
              </div> : ""
            }

            {open && (
                <div className="absolute right-0 bottom-[-50px] mt-2 w-40 bg-[#030E25] border border-[#041432] rounded-lg shadow-md z-20 overflow-hidden">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full cursor-pointer text-left px-4 py-2 text-[#CECFD2] hover:bg-[#041432] transition-colors"
                >
                    Logout
                </button>
                </div>
            )}
            </div>
        </div>
      </div>
    </>
  );
}

export default Header;
