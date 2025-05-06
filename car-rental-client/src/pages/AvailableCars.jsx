import React, { useState, useEffect } from 'react';
import AvailableCar from './AvailableCar';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:5000/cars/available");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const sortedCars = [...cars].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "date-newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "date-oldest") return new Date(a.date) - new Date(b.date);
    return 0; // no sorting
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="mx-4 my-8">
      {/* Sorting Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="">Sort By</option>
          <option value="date-newest">Date Added (Newest)</option>
          <option value="date-oldest">Date Added (Oldest)</option>
          <option value="price-low">Price (Lowest)</option>
          <option value="price-high">Price (Highest)</option>
        </select>
      </div>

      {/* Car Grid */}
      {sortedCars.length === 0 ? (
        <div className="text-center text-red-500 py-10">
          No available cars found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedCars.map((car) => (
            <AvailableCar key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCars;

