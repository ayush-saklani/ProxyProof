'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import logo from '@/assets/img/logo_1.png';
import ProfilePictureMenu from "./ProfilePictureMenu";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const logout = () => {
    localStorage.clear();
    window.location.href = "/signin";  // Redirect to login page
  };
  // Check if not logged in (no cookies), then redirect to /signin
  useEffect(() => {
    if ((!localStorage.getItem('user') && !localStorage.getItem('token'))) {
      localStorage.clear();
      window.location.href = "/signin";
    } else {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);
  return (
    <div className="navbar navbar-expand mx-3">
      <img src={logo.src} className="my-2 h-18 d-inline-block align-text-top " alt="ProxyProof Logo" />
      <span className="text md:flex flex-col gap-1 align-items-center font-bold text-sm hidden ">Attendance Manager</span>
      {/* <h2 className="mx-3 my-3 heading-text">ProxyProof - Attendance Manager</h2> */}
      <div className="d-flex gap-1 align-items-center">
      </div>
      {/* <button className="ms-auto fw-bold h4 px-4 btn btn-lg btn-danger rounded-pill float-end" onClick={logout}>Logout</button> */}
      {
        user && (
          <Popover className="ms-auto float-end relative center flex flex-col gap-1">
            <PopoverButton>
              {
                <img src={user.profile_picture} alt="" className='h-12 w-12 rounded-full p-0 cursor-pointer' />
              }
            </PopoverButton>
            <PopoverPanel anchor="bottom" className="flex flex-col bg-brand-primary-light rounded-xl z-[1001]">
              <ProfilePictureMenu user={user} />
            </PopoverPanel>
          </Popover>
        )
      }
    </div>
  );
}