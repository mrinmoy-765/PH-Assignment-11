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
    model: "",
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add a Car
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="model"
          type="text"
          placeholder="Car Model"
          required
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="price"
          type="number"
          placeholder="Daily Rental Price"
          required
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <select
          name="availability"
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
          required
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="features"
          type="text"
          placeholder="Features (comma separated)"
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="imageUrl"
          type="text"
          placeholder="Image URL"
          required
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          required
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          onChange={handleChange}
          className="w-full textarea textarea-bordered"
        />
        <button
          type="submit"
          className="btn bg-red-600 hover:bg-red-700 text-white w-full"
        >
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
