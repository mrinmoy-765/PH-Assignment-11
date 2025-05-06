import React, { useState, useEffect } from 'react';
import AvailableCar from './AvailableCar';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Optional loading state
  const [error, setError] = useState(null); // Optional error state

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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-4 my-8">
      {cars.length === 0 && (
        <div className="text-center text-red-500 py-10">
          No available cars found.
        </div>
      )}
      {cars.map((car) => (
        <AvailableCar key={car._id} car={car} />
      ))}
    </div>
  );
};

export default AvailableCars;
