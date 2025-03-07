"use client";

import { useState } from "react";
import { Facebook, Linkedin, Twitter, Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/appwrite";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const router = useRouter();

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setError("");
  };

  const toggleForm = () => {
    setIsAnimating(true);
    resetForm();
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    }, 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startCooldown = () => {
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, 60000); // 60 seconds cooldown
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (cooldown) {
      setError("Please wait a minute before trying again.");
      return;
    }

    if (isLoading) {
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      // Validate password
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }

      // Register and create session
      const session = await auth.register(
        formData.email, 
        formData.password, 
        formData.name
      );

      if (session) {
        router.push("/dashboard");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.code === 409) {
        setError("An account with this email already exists. Please try logging in instead.");
      } else if (error.code === 400) {
        setError("Invalid email format. Please enter a valid email address.");
      } else if (error.code === 429) {
        startCooldown();
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Failed to create account. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError("");
    setIsLoading(true);
    
    try {
      const session = await auth.login(formData.email, formData.password);
      if (session) {
        router.push("/dashboard");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.code === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("Failed to sign in. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get button text based on state
  const getSubmitButtonText = () => {
    if (isLoading) return isSignUp ? "Creating Account..." : "Signing In...";
    if (cooldown) return "Please Wait...";
    return isSignUp ? "SIGN UP" : "SIGN IN";
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap");

        :root {
          --green-primary: #2e7d32;
          --gold-primary: #cd950c;
          --white: #ffffff;
          --gray: #6b7280;
          --black: #1f2937;
          --transition: 1.25s;
        }

        *,
        *::after,
        *::before {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          user-select: none;
        }

        body {
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          background: linear-gradient(
            135deg,
            var(--green-primary) 0%,
            var(--gold-primary) 100%
          );
          color: var(--gray);
          padding: 0;
          margin: 0;
        }

        .main {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          overflow: hidden;
        }

        .form-logo {
          margin-bottom: 20px;
          padding: 10px;
          border-radius: 50%;
          background: var(--white);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .form-logo:hover {
          transform: scale(1.05);
        }

        .main-logo {
          border-radius: 50%;
          object-fit: contain;
        }

        .switch-logo {
          border-radius: 50%;
          object-fit: contain;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          width: 50%;
          height: 100%;
          padding: 25px;
          background-color: var(--white);
          transition: var(--transition);
        }

        .form {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          max-width: 400px;
        }

        .form__icon {
          margin: 0 5px;
          opacity: 0.5;
          transition: 0.15s;
          color: var(--green-primary);
        }

        .form__icon:hover {
          opacity: 1;
          transition: 0.15s;
          cursor: pointer;
        }

        .form__icons {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }

        .form__input {
          width: 100%;
          height: 40px;
          margin: 4px 0;
          padding-left: 25px;
          font-size: 13px;
          letter-spacing: 0.15px;
          border: 1px solid #e5e7eb;
          outline: none;
          font-family: "Montserrat", sans-serif;
          background-color: var(--white);
          transition: 0.25s ease;
          border-radius: 8px;
        }

        .form__input:focus {
          border-color: var(--green-primary);
        }

        .form__span {
          margin: 30px 0 12px;
          color: var(--gray);
        }

        .form__link {
          color: var(--gray);
          font-size: 15px;
          margin-top: 25px;
          border-bottom: 1px solid var(--gray);
          line-height: 2;
          cursor: pointer;
        }

        .title {
          font-size: 34px;
          font-weight: 700;
          line-height: 3;
          color: var(--black);
        }

        .description {
          font-size: 14px;
          letter-spacing: 0.25px;
          text-align: center;
          line-height: 1.6;
        }

        .button {
          width: 180px;
          height: 50px;
          border-radius: 25px;
          margin-top: 50px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1.15px;
          background-color: var(--green-primary);
          color: var(--white);
          border: none;
          outline: none;
          cursor: pointer;
          transition: 0.25s;
        }

        .button:hover {
          background-color: #1b5e20;
          transform: translateY(-2px);
        }

        .a-container {
          z-index: 100;
          left: 50%;
        }

        .b-container {
          left: 50%;
          z-index: 0;
        }

        .switch {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 50%;
          padding: 50px;
          z-index: 200;
          transition: var(--transition);
          background: linear-gradient(
            to right bottom,
            var(--green-primary),
            var(--gold-primary)
          );
          overflow: hidden;
        }

        .decorative-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }

        .decorative-circle-1 {
          width: 300px;
          height: 300px;
          top: -10%;
          left: -10%;
        }

        .decorative-circle-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          right: -5%;
        }

        .decorative-circle-3 {
          width: 150px;
          height: 150px;
          bottom: -10%;
          left: 30%;
        }

        .switch__container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: absolute;
          width: 400px;
          padding: 50px 55px;
          transition: var(--transition);
        }

        .switch__title {
          color: var(--white);
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .switch__description {
          color: var(--white);
          font-size: 14px;
          letter-spacing: 0.25px;
          text-align: center;
          line-height: 1.6;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--white);
          margin-bottom: 20px;
          transition: 0.3s ease;
        }

        .is-txr {
          left: 50%;
          transition: var(--transition);
          transform-origin: left;
        }

        .is-txl {
          left: 0;
          transition: var(--transition);
          transform-origin: right;
        }

        .is-z200 {
          z-index: 200;
          transition: var(--transition);
        }

        .is-hidden {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          transition: var(--transition);
        }

        .is-gx {
          animation: is-gx var(--transition);
        }

        @keyframes is-gx {
          0%,
          10%,
          100% {
            width: 50%;
          }
          30%,
          50% {
            width: 55%;
          }
        }

        @media (max-width: 768px) {
          .container,
          .switch {
            width: 100%;
          }

          .a-container,
          .b-container {
            left: 0;
          }

          .is-txr {
            left: 0;
          }
        }

        .home-button {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background-color: var(--white);
          color: var(--green-primary);
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 300;
        }

        .home-button:hover {
          background-color: var(--green-primary);
          color: var(--white);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="main">
        <button className="home-button" onClick={() => router.push("/")}>
          <Home size={20} />
          <span>Back Home</span>
        </button>
        <div
          className={`container a-container ${isSignUp ? "is-txl" : ""}`}
          id="a-container"
        >
          <form className="form" id="a-form" onSubmit={handleSignUp}>
            <div className="form-logo">
              <Image
                src="/images/SLP.png"
                alt="SLP Logo"
                width={80}
                height={80}
                className="main-logo"
              />
            </div>
            <h2 className="form_title title">Create Account</h2>
            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
            <div className="form__icons">
              <Facebook className="form__icon" size={24} />
              <Linkedin className="form__icon" size={24} />
              <Twitter className="form__icon" size={24} />
            </div>
            <span className="form__span">or use email for registration</span>
            <input 
              type="text" 
              name="name"
              className="form__input" 
              placeholder="Name" 
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input 
              type="email" 
              name="email"
              className="form__input" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form__input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button 
              type="submit" 
              className="form__button button submit"
              disabled={isLoading || cooldown}
            >
              {getSubmitButtonText()}
            </button>
          </form>
        </div>

        <div
          className={`container b-container ${
            isSignUp ? "is-txl is-z200" : ""
          }`}
          id="b-container"
        >
          <form className="form" id="b-form" onSubmit={handleSignIn}>
            <div className="form-logo">
              <Image
                src="/images/SLP.png"
                alt="SLP Logo"
                width={80}
                height={80}
                className="main-logo"
              />
            </div>
            <h2 className="form_title title">Sign in to Website</h2>
            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
            <div className="form__icons">
              <Facebook className="form__icon" size={24} />
              <Linkedin className="form__icon" size={24} />
              <Twitter className="form__icon" size={24} />
            </div>
            <span className="form__span">or use your email account</span>
            <input 
              type="email" 
              name="email"
              className="form__input" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form__input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <a className="form__link">Forgot your password?</a>
            <button type="submit" className="form__button button submit">SIGN IN</button>
          </form>
        </div>

        <div
          className={`switch ${isSignUp ? "is-txr" : ""} ${
            isAnimating ? "is-gx" : ""
          }`}
          id="switch-cnt"
        >
          <div className="decorative-circle decorative-circle-1"></div>
          <div className="decorative-circle decorative-circle-2"></div>
          <div className="decorative-circle decorative-circle-3"></div>

          <div
            className={`switch__container ${isSignUp ? "is-hidden" : ""}`}
            id="switch-c1"
          >
            <div className="logo-container">
              <Image
                src="/images/SLP.png"
                alt="SLP Logo"
                width={60}
                height={60}
                className="switch-logo"
              />
            </div>
            <h2 className="switch__title title">Welcome Back !</h2>
            <p className="switch__description description">
              To keep connected with us please login with your personal info
            </p>
            <button
              className="switch__button button switch-btn"
              onClick={toggleForm}
            >
              SIGN IN
            </button>
          </div>

          <div
            className={`switch__container ${isSignUp ? "" : "is-hidden"}`}
            id="switch-c2"
          >
            <div className="logo-container">
              <Image
                src="/images/SLP.png"
                alt="SLP Logo"
                width={60}
                height={60}
                className="switch-logo"
              />
            </div>
            <h2 className="switch__title title">Hello Friend !</h2>
            <p className="switch__description description">
              Enter your personal details and start journey with us
            </p>
            <button
              className="switch__button button switch-btn"
              onClick={toggleForm}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
