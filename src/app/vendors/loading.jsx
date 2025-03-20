"use client";
<<<<<<< HEAD:src/app/vendors/loading.jsx

import React from "react";
=======
>>>>>>> system-design:src/app/loading/page.jsx

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="fancy-loader">
        <svg className="circular-loader" viewBox="0 0 100 100">
          {/* Yellow outer ring with dashes */}
          <circle
            className="loader-path yellow-path"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
          />

          {/* Blue middle ring */}
          <circle
            className="loader-path blue-path"
            cx="50"
            cy="50"
            r="35"
            fill="none"
            strokeWidth="4"
          />

          {/* Red inner ring */}
          <circle
            className="loader-path red-path"
            cx="50"
            cy="50"
            r="25"
            fill="none"
            strokeWidth="5"
          />

          {/* Orbiting particles */}
          <circle className="particle yellow-particle" cx="50" cy="5" r="3" />
          <circle className="particle blue-particle" cx="50" cy="15" r="3" />
          <circle className="particle red-particle" cx="50" cy="25" r="3" />

          {/* Pulsing center */}
          <circle className="center-pulse" cx="50" cy="50" r="8" />
        </svg>

        {/* Radial bursts */}
        <div className="burst-container">
          <div className="burst burst-1"></div>
          <div className="burst burst-2"></div>
          <div className="burst burst-3"></div>
        </div>
      </div>
      <p className="loading-text">Loading vendors...</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
<<<<<<< HEAD:src/app/vendors/loading.jsx
          background-color: var(--background);
          color: var(--foreground);
=======
          background-color: #f8f8f8;
>>>>>>> system-design:src/app/loading/page.jsx
        }

        .fancy-loader {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 30px;
        }

        .circular-loader {
          width: 100%;
          height: 100%;
          transform-origin: center center;
          animation: rotate 30s linear infinite;
        }

        .loader-path {
          stroke-linecap: round;
          stroke-dasharray: 283;
          transform-origin: center;
        }

        .yellow-path {
          stroke: #ffd700;
          stroke-dashoffset: 100;
          animation: dash 3s ease-in-out infinite,
            glow-yellow 4s ease-in-out infinite;
        }

        .blue-path {
          stroke: #2b4b9b;
          stroke-dashoffset: 150;
          animation: dash-reverse 3s ease-in-out infinite,
            glow-blue 4s ease-in-out infinite;
        }

        .red-path {
          stroke: #c22326;
          stroke-dashoffset: 200;
          animation: dash 3s ease-in-out infinite,
            glow-red 4s ease-in-out infinite;
        }

        .particle {
          transform-origin: 50px 50px;
        }

        .yellow-particle {
          fill: #ffd700;
          animation: orbit 3s linear infinite;
        }

        .blue-particle {
          fill: #2b4b9b;
          animation: orbit 5s linear infinite;
        }

        .red-particle {
          fill: #c22326;
          animation: orbit 7s linear infinite;
        }

        .center-pulse {
          fill: white;
          stroke: #ffd700;
          stroke-width: 1;
          animation: pulse 2s ease-in-out infinite alternate,
            color-cycle 6s linear infinite;
        }

        .burst-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .burst {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          opacity: 0;
        }

<<<<<<< HEAD:src/app/vendors/loading.jsx
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
=======
        .burst-1 {
          border: 2px solid #ffd700;
          animation: burst 3s ease-out infinite;
          animation-delay: 0s;
        }

        .burst-2 {
          border: 2px solid #2b4b9b;
          animation: burst 3s ease-out infinite;
          animation-delay: 1s;
        }

        .burst-3 {
          border: 2px solid #c22326;
          animation: burst 3s ease-out infinite;
          animation-delay: 2s;
>>>>>>> system-design:src/app/loading/page.jsx
        }

        .loading-text {
          color: var(--foreground);
          font-size: 18px;
          font-weight: 500;
          margin: 0;
          font-family: var(--font-sans);
          letter-spacing: 0.5px;
          position: relative;
          animation: text-glow 4s ease-in-out infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 283;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -283;
          }
        }

        @keyframes dash-reverse {
          0% {
            stroke-dashoffset: -283;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 283;
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(45px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(45px) rotate(-360deg);
          }
        }

        @keyframes pulse {
          0% {
            r: 8;
            opacity: 0.3;
          }
          100% {
            r: 15;
            opacity: 0.7;
          }
        }

        @keyframes burst {
          0% {
            width: 0;
            height: 0;
            opacity: 0.8;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        @keyframes glow-yellow {
          0%,
          100% {
            filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          }
        }

        @keyframes glow-blue {
          0%,
          100% {
            filter: drop-shadow(0 0 2px rgba(43, 75, 155, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(43, 75, 155, 0.8));
          }
        }

        @keyframes glow-red {
          0%,
          100% {
            filter: drop-shadow(0 0 2px rgba(194, 35, 38, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(194, 35, 38, 0.8));
          }
        }

        @keyframes color-cycle {
          0% {
            stroke: #ffd700;
          }
          33% {
            stroke: #2b4b9b;
          }
          66% {
            stroke: #c22326;
          }
          100% {
            stroke: #ffd700;
          }
        }

        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
          }
          50% {
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;