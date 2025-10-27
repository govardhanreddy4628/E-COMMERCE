import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const UnderConstruction: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <FiAlertCircle className="text-6xl text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Page Under Construction
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        This page is not ready yet. Please check back later.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
};

export default UnderConstruction;
