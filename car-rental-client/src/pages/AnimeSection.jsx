import React from "react";
import Lottie from "lottie-react";
import vehicle from "../assets/vehicle.json";

const AnimeSection = () => {
  return (
    <section className="px-4 py-12 lg:px-24 bg-gray-50">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="text-center lg:text-left max-w-xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            🌄 Your Journey, Your Way
          </h2>
          <p className="text-lg text-gray-600">
            Rent a car that suits your adventure. Whether it's a weekend getaway
            or a long-distance escape, we've got the keys to your next trip.
          </p>
        </div>

        {/* Animation */}
        <div className="w-full lg:w-1/2">
          <Lottie animationData={vehicle} className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
};

export default AnimeSection;
