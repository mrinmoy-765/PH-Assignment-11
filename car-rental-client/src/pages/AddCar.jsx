import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";

const AddCar = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { mongoUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    vehicleType: "",
    color: "",
    mileage: "",
    engine: "",
    transmission: "",
    fuelType: "",
    seats: "",
    doors: "",
    luggageCapacity: "",
    price: "",
    availability: "Available",
    registration: "",
    features: "",
    description: "",
    imageUrl: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a car.");
      return;
    }

    const newCar = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()), // Convert to array
      email: user.email,
      name: mongoUser?.name,
      date: new Date().toISOString(),
      bookingCount: 0,
      status: "available",
    };

    try {
      const response = await axios.post("http://localhost:5000/addCar", newCar);
      if (response.data.insertedId) {
        //alert("Car added successfully!");
        // navigate("/");
        Swal.fire({
          title: "Success!",
          text: "Car Registgtered Successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Something went wrong while adding the car.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add a Car
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="brand"
          type="text"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="model"
          type="text"
          placeholder="Car Model"
          value={formData.model}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <input
          name="year"
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="vehicleType"
          type="text"
          placeholder="Sedan/SUV/Jeep/Microbus/pickup"
          value={formData.vehicleType}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="color"
          type="text"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="mileage"
          type="text"
          placeholder="Mileage"
          value={formData.mileage}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="engine"
          type="text"
          placeholder="Engine"
          value={formData.engine}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="transmission"
          type="text"
          placeholder="Transmission"
          value={formData.transmission}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="fuelType"
          type="text"
          placeholder="Fuel Type"
          value={formData.fuelType}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="seats"
          type="number"
          placeholder="Seats"
          value={formData.seats}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="doors"
          type="number"
          placeholder="Doors"
          value={formData.doors}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="luggageCapacity"
          type="text"
          placeholder="Luggage Capacity"
          value={formData.luggageCapacity}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="price"
          type="number"
          placeholder="Daily Rental Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="w-full input input-bordered"
        >
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
        <input
          name="registration"
          type="text"
          placeholder="Vehicle Registration Number"
          value={formData.registration}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <input
          name="features"
          type="text"
          placeholder="Features (comma separated)"
          value={formData.features}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="imageUrl"
          type="text"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full textarea textarea-bordered grid col-span-2"
          required
        />
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-700 text-white w-full grid col-span-2"
        >
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
