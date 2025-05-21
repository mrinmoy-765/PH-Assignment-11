import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FaCarSide, FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

export default function Navbar() {
  const { firebaseUser, mongoUser, logOut, loading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut() // Firebase signOut
      .then(() => {
        axios
          .post(
            "https://car-rental-server-zeta.vercel.app/logout",
            {},
            { withCredentials: true }
          )
          .then(() => {
            Swal.fire("Logged out!", "", "success");
            navigate("/");
          })
          .catch((err) => {
            console.error("Error clearing cookie:", err);
          });
      })
      .catch((error) => {
        console.error("Firebase logout error:", error);
      });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClass =
    "block py-2 px-2 hover:text-[#FD7014]  transition duration-300";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <header className="bg-[#393E46] text-[#EEEEEE] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Site Name */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-red-600"
        >
          <FaCarSide className="text-red-600" size={28} />
          <span>XoRide</span>
        </Link>

        {/* Hamburger Menu (mobile) */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav
          className={`lg:flex lg:items-center lg:space-x-3 text-base font-normal
                        ${
                          isOpen ? "block" : "hidden"
                        } lg:block absolute lg:static top-16 left-0 w-full lg:w-auto bg-[#393E46] lg:bg-transparent z-50`}
        >
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          <Link to="/available-cars" className={navLinkClass}>
            Available Cars
          </Link>

          {!firebaseUser ? (
            <Link to="/login" className={navLinkClass}>
              Log In
            </Link>
          ) : (
            <>
              <Link to="/addCar" className={navLinkClass}>
                Add Car
              </Link>
              <Link to="/my-cars" className={navLinkClass}>
                My Cars
              </Link>
              <Link to="/bookings" className={navLinkClass}>
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className={`${navLinkClass} text-left`}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
