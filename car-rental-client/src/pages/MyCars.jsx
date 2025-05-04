import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const MyCars = () => {
  const { userCar, loading } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    if (userCar) {
      setCars(userCar);
    }
  }, [userCar]);

  const handleDelete = (carId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/cars/${carId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire(
                "Deleted!",
                "Your car has been removed successfully.",
                "success"
              );

              setCars(cars.filter((car) => car._id !== carId));
            }
          });
      }
    });
  };

  const handleEditClick = (car) => {
    setSelectedCar(car);
    document.getElementById("edit_modal").showModal();
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/cars/${selectedCar._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCar),
      });

      const data = await res.json();

      if (data.modifiedCount > 0) {
        toast.success("Car updated successfully!");
        // Optimistically update local state
        setCars((prev) =>
          prev.map((car) => (car._id === selectedCar._id ? selectedCar : car))
        );
        document.getElementById("edit_modal").close(); // ✅ Close modal
      } else {
        toast.warn("No changes were made.");
      }
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCar({ ...selectedCar, [name]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

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
                    onClick={() => handleEditClick(car)}
                    className="text-blue-600 hover:text-blue-800 text-xl mt-5"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="text-red-600 hover:text-red-800 text-xl mt-5"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-5xl">
          {" "}
          {/* Optional: Wider modal for better spacing */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            Edit Car - {selectedCar?.model}
          </h3>
          {/* Image */}
          <div className="flex justify-center mb-4">
            <img
              src={selectedCar?.imageUrl}
              alt={selectedCar?.model}
              className="w-48 h-32 object-cover rounded shadow"
            />
          </div>
          {selectedCar ? (
            <>
              <form
                onSubmit={handleUpdateCar}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Model */}
                <div>
                  <p className="font-semibold mb-1">Model</p>
                  <input
                    type="text"
                    name="model"
                    value={selectedCar.model}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Model"
                  />
                </div>

                {/* Price */}
                <div>
                  <p className="font-semibold mb-1">Price (Daily)</p>
                  <input
                    type="number"
                    name="price"
                    value={selectedCar.price}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Price"
                  />
                </div>

                {/* Availability */}
                <div>
                  <p className="font-semibold mb-1">Availability</p>
                  <select
                    name="availability"
                    value={selectedCar.availability}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Registration */}
                <div>
                  <p className="font-semibold mb-1">Registration Number</p>
                  <input
                    name="registration"
                    type="text"
                    value={selectedCar.registration}
                    required
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Features */}
                <div>
                  <p className="font-semibold mb-1">Features</p>
                  <input
                    name="features"
                    type="text"
                    value={selectedCar.features}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Location */}
                <div>
                  <p className="font-semibold mb-1">Location</p>
                  <input
                    name="location"
                    value={selectedCar.location}
                    required
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <p className="font-semibold mb-1">Image URL</p>
                  <input
                    name="imageUrl"
                    value={selectedCar.imageUrl}
                    required
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <p className="font-semibold mb-1">Description</p>
                  <textarea
                    name="description"
                    value={selectedCar.description}
                    required
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full"
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button type="submit" className="btn btn-primary w-full">
                    Update
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-10">Loading Car Details...</div>
          )}
        </div>
      </dialog>
      <ToastContainer
        position="top-right"
        autoClose={500000}
        hideProgressBar
        pauseOnHover
      />
    </div>
  );
};

export default MyCars;
