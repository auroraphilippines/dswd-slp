"use client";

import React from "react";

export default function LoadingPage() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      <p className="loading-text">Loading programs...</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;  
          justify-content: center;
          min-height: 100vh;
          background-color: var(--background);
          color: var(--foreground);
        }

        .loading-spinner {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 24px;
        }

        .circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid transparent;
          animation: rotate var(--duration) linear infinite;
        }

        .circle-1 {
          --duration: 1.5s;
          border-top-color: var(--primary);
          border-right-color: var(--primary);
        }

        .circle-2 {
          --duration: 2s;
          width: 75%;
          height: 75%;
          top: 12.5%;
          left: 12.5%;
          border-top-color: var(--destructive);
          border-left-color: var(--destructive);
          animation-direction: reverse;
        }

        .circle-3 {
          --duration: 2.5s;
          width: 50%;
          height: 50%;
          top: 25%;
          left: 25%;
          border-top-color: var(--secondary);
          border-bottom-color: var(--secondary);
        }

        .loading-text {
          color: var(--foreground);
          font-size: 18px;
          font-weight: 500;
          margin: 0;
          font-family: var(--font-sans);
          letter-spacing: 0.5px;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}







