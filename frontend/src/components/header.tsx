'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import logo from '@/assets/img/logo.png';

export default function Header() {
  const logout = () => {
    // Clear all cookies
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    // document.cookie.split(";").forEach((c) => {
    //   document.cookie = c
    //     .replace(/^ +/, "")
    //     .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    // });
    window.location.href = "/login";  // Redirect to login page
  };
  const pathname = usePathname();
  const showLogout = pathname.startsWith("/edit");

  // Check if not logged in (no cookies), then redirect to /login
  useEffect(() => {
    if (pathname.startsWith("/edit") && (!localStorage.getItem('accessToken'))) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <nav className="navbar navbar-expand mx-3">
      <img src={logo.src} className="h-18 d-inline-block align-text-top " alt="RollCall Logo" />
      <h2 className="mx-3 my-3 heading-text">RollCall - Attendance Manager</h2>
      <div className="d-flex gap-1 align-items-center">
        <Link href="/student" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-bold text-2xl">
          Student
        </Link>
        <Link href="/faculty" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md font-bold text-2xl">
          Faculty
        </Link>
      </div>
      {
        showLogout &&
        <button className="ms-auto fw-bold h4 px-4 btn btn-lg btn-danger rounded-pill float-end" onClick={logout}>Logout</button>
      }
    </nav>
  );
}