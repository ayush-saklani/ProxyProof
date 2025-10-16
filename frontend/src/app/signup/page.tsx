'use client';

import logo from '@/assets/img/logo.png';

export default function LoginPage() {

  return (
    <>
      <title>ProxyProof | Sign up</title>

      <div className="container p-5 signupbox shadow-lg">
        <div className="row">
          <div className="">
            <img src={logo.src} className="h-16 d-inline-block align-text-top " />
            <h1 className="heading-text my-3">Sign up</h1>
            <p className="text my-2 text-lg font-semibold">Signup to Navit to complete signup.</p>
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