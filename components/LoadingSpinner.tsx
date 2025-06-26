import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
