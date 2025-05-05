import React, { useState, useEffect } from 'react';
import AvailableCar from './AvailableCar';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Optional loading state
  const [error, setError] = useState(null); // Optional error state

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cars/available');
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars');
        setLoading(false);
      }
    };

    fetchAvailableCars();
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
      {cars.map((car) => (
        <AvailableCar key={car._id} car={car} />
      ))}
    </div>
  );
};

export default AvailableCars;
