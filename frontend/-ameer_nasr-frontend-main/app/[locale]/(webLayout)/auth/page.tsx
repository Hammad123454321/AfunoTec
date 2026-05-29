"use client";

import { useState } from "react";
import { SignInForm } from "./_components/SignInForm";
import { SignUpForm } from "./_components/SignUpForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const onLoginSubmit = (data: unknown) => {
    console.log("Login:", data);
  };

  const onSignupSubmit = (data: unknown) => {
    console.log("Signup:", data);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center lg:items-stretch flex-col lg:flex-row gap-6 max-w-5xl w-full">
        <SignInForm
          isActive={isLogin}
          onClick={() => setIsLogin(true)}
          onSubmit={onLoginSubmit}
        />

        <div className="self-stretch w-3 py-10 hidden lg:block">
          <div className="size-full bg-white rounded-full"></div>
        </div>

        <SignUpForm
          isActive={!isLogin}
          onClick={() => setIsLogin(false)}
          onSubmit={onSignupSubmit}
        />
      </div>
    </div>
  );
}
