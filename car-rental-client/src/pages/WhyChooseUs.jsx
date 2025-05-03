import React from "react";
import { FaCar, FaDollarSign, FaMousePointer, FaHeadset } from "react-icons/fa";

const features = [
  {
    icon: <FaCar size={40} className="text-red-600" />,
    title: "Wide Variety of Cars",
    description: "From budget-friendly options to luxury vehicles.",
  },
  {
    icon: <FaDollarSign size={40} className="text-red-600" />,
    title: "Affordable Prices",
    description: "Competitive daily rates you can count on.",
  },
  {
    icon: <FaMousePointer size={40} className="text-red-600" />,
    title: "Easy Booking Process",
    description: "Seamlessly book your ride in just a few clicks.",
  },
  {
    icon: <FaHeadset size={40} className="text-red-600" />,
    title: "24/7 Customer Support",
    description: "Always available for all your queries.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800">
          Why Choose Us?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
