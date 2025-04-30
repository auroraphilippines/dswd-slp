"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from "@/service/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { sendPasswordResetEmail, updatePassword, signInWithEmailAndPassword } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Starting password reset request for email:", email);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      // Query users collection to find the user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      console.log("Query results:", {
        size: querySnapshot.size,
        docs: querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }))
      });
      
      if (querySnapshot.empty) {
        throw new Error("No account found with this email address");
      }

      // Get the first matching user document
      const userDoc = querySnapshot.docs[0];
      setUserId(userDoc.id);
      
      console.log("User found:", {
        id: userDoc.id,
        data: userDoc.data()
      });

      setIsEmailVerified(true);
      toast.success("Email verified successfully!");
    } catch (error) {
      console.error("Error during email verification:", error);
      let errorMessage = "Failed to verify email";
      
      if (error.message === "No account found with this email address") {
        errorMessage = "No account found with this email address";
      }
      
      console.error("Error details:", {
        message: error.message
      });
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Starting password reset process");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both passwords");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      if (!userId) {
        throw new Error("User ID not found. Please verify your email again.");
      }

      // Get user document
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      // Update password in Firestore
      const updateData = {
        password: newPassword,
        updatedAt: new Date().toISOString()
      };

      console.log("Attempting to update user password in Firestore");
      await updateDoc(userRef, updateData);
      console.log("User password updated in Firestore");

      toast.success("Password has been successfully reset! You can now login with your new password.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        userId: userId
      });
      
      let errorMessage = "Failed to reset password";
      if (error.code === 'permission-denied') {
        errorMessage = "You don't have permission to reset the password. Please contact support.";
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

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray);
          cursor: pointer;
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
        <p className="description">
          {!isEmailVerified 
            ? "Enter your email address to verify your account."
            : "Please Enter Your New Password."}
        </p>

        {!isEmailVerified ? (
          <form onSubmit={handleEmailSubmit}>
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
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {showPassword ? (
                <EyeOff className="password-toggle" size={20} onClick={() => setShowPassword(false)} />
              ) : (
                <Eye className="password-toggle" size={20} onClick={() => setShowPassword(true)} />
              )}
            </div>

            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {showConfirmPassword ? (
                <EyeOff className="password-toggle" size={20} onClick={() => setShowConfirmPassword(false)} />
              ) : (
                <Eye className="password-toggle" size={20} onClick={() => setShowConfirmPassword(true)} />
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </>
  );
} 