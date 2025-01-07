import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ text }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner">
        <h2 className="spinner-text">{text}</h2>
        <div className="loading-spinner">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
