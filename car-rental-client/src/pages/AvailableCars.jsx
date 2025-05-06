import React, { useState, useEffect } from 'react';
import AvailableCar from './AvailableCar';
import LoadingSpinner from '../components/LoadingSpinner';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Search filtering
  const filteredCars = cars.filter((car) =>
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.brand && car.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    car.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting after filtering
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "date-newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "date-oldest") return new Date(a.date) - new Date(b.date);
    return 0;
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
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by model, brand, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:max-w-md"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="select select-bordered w-full md:max-w-xs"
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
          No cars match your search.
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


