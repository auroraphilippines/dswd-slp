import React from "react";

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      <p className="loading-text">Loading...</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: rgba(255, 255, 255, 0.9);
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
          border-top-color: #3498db;
          border-right-color: #3498db;
        }

        .circle-2 {
          --duration: 2s;
          width: 75%;
          height: 75%;
          top: 12.5%;
          left: 12.5%;
          border-top-color: #e74c3c;
          border-left-color: #e74c3c;
          animation-direction: reverse;
        }

        .circle-3 {
          --duration: 2.5s;
          width: 50%;
          height: 50%;
          top: 25%;
          left: 25%;
          border-top-color: #2ecc71;
          border-bottom-color: #2ecc71;
        }

        .loading-text {
          color: #333;
          font-size: 18px;
          font-weight: 500;
          margin: 0;
          font-family: system-ui, -apple-system, sans-serif;
          letter-spacing: 0.5px;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
