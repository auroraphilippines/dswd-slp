"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Signup from "./signup";
import Signin from "./signin";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    }, 10);
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <>
      {/* Keep your existing styles here */}
      <style jsx global>{`
        // ...existing styles...
      `}</style>

      <div className="main">
        <button className="home-button" onClick={goToHome}>
          <Home size={20} />
          <span>Back Home</span>
        </button>

        <Signup isSignUp={isSignUp} toggleForm={toggleForm} />
        <Login isSignUp={isSignUp} toggleForm={toggleForm} />

        <div
          className={`switch ${isSignUp ? "is-txr" : ""} ${
            isAnimating ? "is-gx" : ""
          }`}
          id="switch-cnt"
        >
          <div className="decorative-circle decorative-circle-1"></div>
          <div className="decorative-circle decorative-circle-2"></div>
          <div className="decorative-circle decorative-circle-3"></div>
        </div>
      </div>
    </>
  );
}
