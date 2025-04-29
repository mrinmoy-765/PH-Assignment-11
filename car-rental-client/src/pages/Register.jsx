import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Register() {
  const { createUser, loading } = useContext(AuthContext);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (!form.photoURL.trim()) newErrors.photoURL = "Photo URL is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      //registration logic

      const { name, email, photoURL, password } = form;

      //firebase user reg setup
      createUser(email, password)
        .then((result) => {
          const createdAt = result?.user?.metadata?.creationTime;

          //saving user data to mongodb
          const newUser = {
            name,
            email,
            photoURL,
            createdAt,
          };

          axios
            .post("http://localhost:5000/users", newUser)
            .then((response) => {
              if (response.data.insertedId) {
                Swal.fire({
                  title: "Success!",
                  text: "Registration Successful",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  window.location.href = "/login";
                });
              } else {
                // MongoDB error fallback (if insertedId not returned)
                Swal.fire({
                  title: "Database Error",
                  text: "Something went wrong while saving user info.",
                  icon: "error",
                });
              }
            })
            .catch((mongoError) => {
              console.error("MongoDB Error:", mongoError);
              Swal.fire({
                title: "Database Error",
                text:
                  mongoError.response?.data?.message ||
                  "Unable to save user to the database.",
                icon: "error",
              });
            });
        })
        .catch((firebaseError) => {
          console.error("Firebase Error:", firebaseError);
          Swal.fire({
            title: "Registration Failed",
            text:
              firebaseError.message ||
              "Firebase error occurred during registration.",
            icon: "error",
          });
        });

      e.target.reset();
      setErrors({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222831] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#393E46] p-8 rounded-xl shadow-lg text-[#EEEEEE]">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-[#EEEEEE]">Name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text text-[#EEEEEE]">Email</span>
            </label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text text-[#EEEEEE]">Password</span>
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text text-[#EEEEEE]">Photo URL</span>
            </label>
            <input
              type="text"
              name="photoURL"
              className="input input-bordered w-full"
              value={form.photoURL}
              onChange={handleChange}
            />
            {errors.photoURL && (
              <p className="text-red-400 text-sm mt-1">{errors.photoURL}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn w-full bg-[#FD7014] border-none hover:bg-[#e76100] text-white"
            >
              Register
            </button>
          </div>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              className="text-[#FD7014] cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
