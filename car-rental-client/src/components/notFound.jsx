import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#222831] flex flex-col items-center justify-center px-4 text-center text-[#EEEEEE]">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>
      <p className="mb-8 text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn bg-[#FD7014] text-white border-none hover:bg-[#e76100]"
      >
        Go Home
      </Link>
    </div>
  );
}
