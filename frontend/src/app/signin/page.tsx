'use client';
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiLogin } from "react-icons/hi";
import { toast } from "react-hot-toast";
import logo from '@/assets/img/logo.png';
import gif from "@/assets/img/logo.png";
import { serverlink } from "@/utils/constant";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [sendButtonFreeze, setSendButtonFreeze] = useState(false);
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    setSendButtonFreeze(true);
    setError("");
    fetch(`${serverlink}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
      .then(response => response.json())
      .then(data => {
        // console.log('Success:', data);
        if (data.success) {
          // console.log(data.data.user);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("token", data.data.token);
          toast.success("Sign In successful");
          setError("");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
          return;
        } else {
          setError(data.errors || "Something went wrong.");
        }
        setSendButtonFreeze(false);
      }).catch(error => {
        setSendButtonFreeze(false);
        console.error('out of service.. ~_~  @_@', error);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <div className="hidden lg:block lg:w-3/5 relative">
        <img src={gif.src} className=" w-full h-full object-contain p-20" alt="Cover Photo" />
      </div>
      <div className="flex flex-grow justify-center items-center bg-white rounded-l-3xl p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img
              onClick={() => window.location.replace("/")}
              className="hover:cursor-pointer w-40 h-40"
              src={logo.src}
              alt=""
            />
          </div>
          <div className="space-y-6">
            <p className="text text-3xl font-bold text-center my-2">Sign In</p>
            {
              <div className="text text-red-500 text-center m-0 h-2">{error}</div>
            }
            <div className="flex flex-col">
              <label
                htmlFor="emailorphone"
                className="text text-md font-semibold mb-1"
              >
                Email
              </label>
              <input
                className="text border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                id="emailorphone"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text text-md font-semibold mb-1">
                Password
              </label>
              <div className="relative w-full">
                <input
                  className="text border border-gray-300 rounded-md py-2 px-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {
                    showPassword ?
                      <FaEyeSlash className="h-5 w-5" /> :
                      <FaEye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>
            <div className="flex text-sm">
              <button
                className="text text-md text-primary font-semibold"
                onClick={() => {
                  window.location.href = "https://navit.vercel.app/signin";
                }}
              >
                Forgot password?
              </button>
            </div>
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleLogin}
                disabled={sendButtonFreeze}
                className={`text text-md flex w-full items-center justify-center gap-2 px-6 py-3 font-bold text-white text-md transition-colors duration-150
                  ${sendButtonFreeze ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-primary-dark"}
                  rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-primary/30`}
              >
                <HiLogin className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            </div>
            <div className="text text-md text-center text-md gap-1 flex w-full justify-center items-center">
              <span>Don’t have an account?</span>
              <a href="https://navit.vercel.app/signup" target="_blank" rel="noopener noreferrer">
                <span className="text text-md text-primary font-bold">Sign up now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signin;