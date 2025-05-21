import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentListings = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios
      .get("https://car-rental-server-xi.vercel.app/cars/recent")
      .then((res) => {
        setCars(res.data.slice(0, 8));
      })
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <div className="mx-4 mt-4 mb-8">
      <h2 className="text-2xl font-bold mb-6">Recent Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {cars.map((car) => (
          <div
            key={car.id}
            className="card bg-base-100 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md"
          >
            <div className="card-body">
              <div className="flex justify-end items-center mb-2">
                <span className="badge badge-success text-xs">
                  {car.availability}
                </span>
              </div>
              <img
                src={car.imageUrl}
                alt=""
                class="w-full h-52 object-contain"
              />
              <h2 className="text-xl font-semibold mt-4">{car.model}</h2>
              <p className="text-lg font-medium text-blue-600">
                ${car.price}/day
              </p>

              <ul className="mt-4 text-sm space-y-1">
                <li>
                  <strong>Engine: </strong> {car.engine}
                </li>
                <li>
                  <strong>Location:</strong> {car.location}
                </li>
              </ul>
              <span className="text-sm text-gray-500">
                Added {formatDate(car.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper to format date as "Added X days ago"
const formatDate = (dateString) => {
  const posted = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
};

export default RecentListings;
