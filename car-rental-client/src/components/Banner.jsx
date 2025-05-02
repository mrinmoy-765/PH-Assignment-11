import React from "react";
import banner from "../assets/banner.png";

const Banner = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <img src={banner} alt="Banner" className="w-full h-full object-cover" />

      {/* Text & Button Container */}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-2 sm:px-3 md:px-6">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4">
          Drive Your Dreams Today!
        </h1>

        {/* Subheading Badge */}
        <div className="mb-4 mt-44">
          <div className="px-4 py-2 text-sm sm:text-base text-white font-light bg-transparent border border-red-600 hover:bg-red-600 rounded-lg transition duration-300">
            Your Next Car Awaits You
          </div>
        </div>

        {/* Button */}
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300">
          View Available Cars
        </button>
      </div>
    </div>
  );
};

export default Banner;
