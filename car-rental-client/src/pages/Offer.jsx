import React from "react";
import Lottie from "lottie-react";
import offer from "../assets/offer.json";
import offer_banner from "../assets/offer_banner.jpg";
import { Link } from "react-router-dom";

const Offer = () => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-100 to-indigo-100">
      <div className="flex flex-col md:flex-row w-full h-auto md:h-[70vh]">
        {/* Animation Section */}
        <div className="w-full md:w-1/4 flex justify-center items-center p-4 sm:p-6 md:p-4">
          <Lottie
            animationData={offer}
            className="w-[60%] sm:w-[70%] md:w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-full"
          />
        </div>

        {/* Image Section with overlay text and button */}
        <div className="w-full md:w-3/4 relative">
          <img
            src={offer_banner}
            alt="Offer Banner"
            className="w-full h-full object-cover max-h-[300px] sm:max-h-[400px] md:max-h-full"
          />

          {/* Top-left text */}
          <div className="absolute top-4 left-4 bg-black/50 text-white text-sm sm:text-base md:text-lg font-semibold px-3 py-1 rounded">
            Get 15% off for weekend rentals!
          </div>

          {/* Bottom-right button */}
          <div className="absolute bottom-4 right-4 text-right space-y-2">
            <p className="text-xl text-white font-extrabold">
              Luxury cars at $99/day this holiday season!
            </p>
            <Link to="/available-cars">
              <button className="bg-indigo-500 hover:bg-indigo-700 text-white px-5 py-2 text-sm sm:text-base rounded-lg shadow-lg transition">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;
