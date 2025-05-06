"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "@/service/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Password reset link has been sent to your email!");
    } catch (error) {
      console.error("Error sending reset email:", error);
      let errorMessage = "Failed to send reset email";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
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
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Montserrat", sans-serif;
          background: linear-gradient(
            135deg,
            var(--green-primary) 0%, 
            var(--gold-primary) 100%
          );
          color: var(--gray);
        }

        .container {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background: var(--white);
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.5rem;
          color: var(--green-primary);
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: var(--gold-primary);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .logo {
          border-radius: 50%;
          object-fit: contain;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--black);
          text-align: center;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 2rem;
          color: var(--gray);
        }

        .input-container {
          position: relative;
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray);
        }

        .input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 0.875rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .input:focus {
          border-color: var(--green-primary);
        }

        .button {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--green-primary);
          color: var(--white);
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #1b5e20;
        }

        .button:disabled {
          background-color: #a5d6a7;
          cursor: not-allowed;
        }

        .error-message {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          text-align: center;
        }

        .success-message {
          color: var(--green-primary);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          text-align: center;
          padding: 1rem;
          background-color: rgba(46, 125, 50, 0.1);
          border-radius: 0.5rem;
        }

        .email-sent-container {
          text-align: center;
          padding: 1rem;
        }

        .email-sent-icon {
          font-size: 3rem;
          color: var(--green-primary);
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        
        <div className="back-button" onClick={goBack}>
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </div>

        <div className="logo-container">
          <Image
            src="/images/SLP.png"
            alt="SLP Logo"
            width={80}
            height={80}
            className="logo"
          />
        </div>

        <h1 className="title">Reset Password</h1>
        
        {!emailSent ? (
          <>
            <p className="description">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSendResetLink}>
              <div className="input-container">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="email-sent-container">
            <Mail className="email-sent-icon" size={48} />
            <h2 className="title">Check Your Email</h2>
            <p className="description">
              We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
            </p>
            <button
              className="button"
              onClick={() => router.push('/login')}
              style={{ marginTop: '1rem' }}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </>
  );
} 