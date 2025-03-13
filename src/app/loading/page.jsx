import React from "react";

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-inner"></div>
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

        .spinner {
          width: 50px;
          height: 50px;
          position: relative;
          margin-bottom: 16px;
        }

        .spinner-inner {
          box-sizing: border-box;
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #333;
          font-size: 16px;
          margin: 0;
          font-family: Arial, sans-serif;
        }

        @keyframes spin {
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
