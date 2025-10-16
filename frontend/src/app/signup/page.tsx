'use client';

import logo from '@/assets/img/logo.png';
import gif from '@/assets/img/logo.gif';

export default function LoginPage() {

  return (
    <>
      <title>Proxyproof | Sign up</title>
      <div className="container p-3 signupbox shadow-lg">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 md:col-span-6 flex justify-center items-center p-4">
            <img src={gif.src} className="w-full max-w-xs md:max-w-md object-contain" alt="Cover Photo" />
          </div>
          <div className="col-span-12 md:col-span-6 p-4">
            {/* <img src={logo.src} className="h-16 d-inline-block align-text-top " alt="ProxyProof logo" /> */}
            <h1 className="heading-text my-3">Sign up</h1>
            <p className="text my-2 text-lg font-semibold">Signup to Navit™ to complete signup.</p>
            <p className="text my-2 text-lg font-semibold">Use same credentials to sign in across both apps.</p>
            <a
              className="text my-3 text-xl font-bold"
              href="https://navit.vercel.app/signup"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign up on Navit
            </a>
          </div>
        </div>
      </div>
    </>
  );
}