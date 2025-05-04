import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";
import { FaTrash, FaEdit } from "react-icons/fa";

const MyCars = () => {
  const { userCar, loading } = useContext(AuthContext);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    if (userCar) {
      setCars(userCar);
    }
  }, [userCar]);

  const handleDelete = (id) => {
    Swal.fire("Delete action coming soon!", "", "info");
  };

  const handleUpdate = (id) => {
    Swal.fire("Not implemented", "Update form coming soon!", "info");
  };

  // ✅ Show loader while context is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

  // ✅ Once loading is done, if no cars
  if (!cars || cars.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No cars added yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Cars
      </h2>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr className="text-center">
              <th>Image</th>
              <th>Model</th>
              <th>Price (Daily)</th>
              <th>Booking Count</th>
              <th>Availability</th>
              <th>Registered Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {cars.map((car) => (
              <tr key={car._id} className="text-sm text-center">
                <td className="p-2">
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="p-2 font-medium">{car.model}</td>
                <td className="p-2">${car.price}</td>
                <td className="p-2">{car.bookingCount || 0}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      car.availability === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {car.availability}
                  </span>
                </td>
                <td className="p-2 text-xs text-gray-600">
                  {new Date(car.date).toLocaleDateString()}
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdate(car._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCars;
