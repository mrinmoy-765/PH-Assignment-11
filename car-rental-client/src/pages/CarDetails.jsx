import React, { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaMapMarkerAlt, FaUserAlt, FaEnvelope } from "react-icons/fa";
import { GiCalendarHalfYear } from "react-icons/gi";
import { BsArrowUpRight } from "react-icons/bs";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineUser,
} from "react-icons/hi";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const CarDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mongoUser } = useContext(AuthContext);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const openModal = (carId) => {
    setSelectedCarId(carId);
    document.getElementById("booking_modal").showModal();
  };

  const handleConfirmBooking = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both 'from' and 'to' dates.");
      return;
    }

    //preparing data for booking
    const booking = {
      carId: selectedCarId,
      carInfo: {
        model: details.model,
        vehicleType: details.vehicleType,
        engine: details.engine,
        transmission: details.transmission,
        fuelType: details.fuelType,
        description: details.description,
        image: details.imageUrl,
        price: details.price,
      },
      userInfo: {
        userId: mongoUser?._id,
        name: mongoUser?.name,
        email: mongoUser?.email,
        photoUrl: mongoUser?.photoUrl,
      },
      fromDate,
      toDate,
      bookingStatus: "pending",
      bookedAt: new Date(),
    };

    //create a booking
    try {
      const res = await axios.post("http://localhost:5000/bookings", booking);
      if (res.data.insertedId) {
        document.getElementById("booking_modal").close();
        document.getElementById("success_modal").showModal();
      }
    } catch (err) {
      console.error(err);
      document.getElementById("booking_modal").close();
      document.getElementById("error_modal").showModal();
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/details/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        Swal.fire("Error", "Could not fetch car details.", "error");
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!details) {
    return <div className="text-center mt-10 text-red-500">No car found!</div>;
  }

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm">
      {/* image */}
      <div className="w-full md:w-1/2">
        <figure>
          <img
            src={details.imageUrl}
            alt={details.model}
            className="object-cover h-full w-full"
          />
        </figure>
      </div>
      {/* info */}
      <div className="card-body">
        <div className="flex justify-between">
          <div>
            <p
              className="card-title text-2xl tracking-wide mt-0 flex items-center gap-1 cursor-pointer group relative w-fit"
              onClick={() =>
                document.getElementById("vehicle_modal").showModal()
              }
            >
              <span className="group-hover:text-cyan-700 transition-colors duration-200">
                {details.model}
              </span>
              <BsArrowUpRight className="group-hover:text-cyan-700 transition-colors duration-200" />

              {/* Tooltip */}
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Click to view specifications
              </span>
            </p>

            <p className="flex items-center gap-2">
              <GiCalendarHalfYear className="text-lg  text-slate-900" />
              {details.year}
            </p>
            <div className="mt-2.5">
              <p className="font-bold text-base">Brand:{details.brand}</p>
              <p className="text-sm text-red-500 font-semibold">
                {details.registration}
              </p>
            </div>
          </div>
          <div>
            {/* available and price */}
            <div className="flex flex-col items-end">
              <p>
                <span
                  className={`px-2 py-1 rounded-xl  text-xs ${
                    details.availability === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {details.availability}
                </span>
              </p>
              <p className="mt-2.5 text-2xl font-semibold text-amber-400">
                ${details.price}
                <span className="text-black">/day</span>
              </p>
            </div>
          </div>
        </div>

        {/* cabin info */}
        <div className="p-4 mt-1 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Cabin Details
            </h3>

            <p className="text-gray-700 mb-1">
              <span className="font-medium text-gray-600">
                Sitting Capacity:
              </span>{" "}
              <span className="text-cyan-700 font-semibold">
                {details.seats}
              </span>
            </p>

            <p className="text-gray-700 mb-1">
              <span className="font-medium text-gray-600">Doors:</span>{" "}
              <span className="text-cyan-700 font-semibold">
                {details.doors}
              </span>
            </p>

            <p className="text-gray-700 mb-1">
              <span className="font-medium text-gray-600">
                Luggage Capacity:
              </span>{" "}
              <span className="text-cyan-700 font-semibold">
                {details.luggageCapacity}
              </span>
            </p>

            <p className="text-gray-700">
              <span className="font-medium text-gray-600">Features:</span>{" "}
              <span className="text-cyan-700 font-semibold">
                {details.features}
              </span>
            </p>
          </div>
        </div>

        {/* contact */}
        <div className="p-4 mt-1 bg-white rounded-xl shadow-md border border-gray-100">
          <h3 className="font-semibold text-lg mb-2">Contact Owner</h3>
          <div className="flex justify-around">
            <p className="flex items-center gap-2">
              <HiOutlineUser className="text-xl text-primary" />
              {details.name}
            </p>
            <p className="flex items-center gap-2">
              <HiOutlineMail className="text-xl text-primary" />
              {details.email}
            </p>
          </div>
        </div>

        {/* book button */}
        <div className="card-actions justify-end">
          {/* Book Button */}
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => openModal(details._id)}
            >
              Book
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="vehicle_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl mb-2">Vehicle Info</h3>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Vehicle Type:</span>{" "}
              {details.vehicleType}
            </p>
            <p>
              <span className="font-semibold">Engine Type:</span>{" "}
              {details.engine}
            </p>
            <p>
              <span className="font-semibold">Transmission:</span>{" "}
              {details.transmission}
            </p>
            <p>
              <span className="font-semibold">Fuel Type:</span>{" "}
              {details.fuelType}
            </p>

            <h4 className="text-lg font-bold mt-4">Description</h4>
            <p>{details.description}</p>
          </div>

          {/* ✅ Closing modal footer inside modal-box */}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Booking Modal */}
      <dialog id="booking_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Select Booking Dates</h3>

          <div className="mb-2">
            <label className="block mb-1">From:</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">To:</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button className="btn btn-primary" onClick={handleConfirmBooking}>
              Confirm Booking
            </button>
          </div>
        </div>
      </dialog>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-green-600">
            Booking Successful!
          </h3>
          <p className="py-2">Your booking has been confirmed.</p>
          <form method="dialog" className="modal-backdrop">
            <button className="btn btn-success">Close</button>
          </form>
        </div>
      </dialog>

      {/* Error Modal */}
      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-600">Booking Failed</h3>
          <p className="py-2">Something went wrong. Please try again later.</p>
          <form method="dialog" className="modal-backdrop">
            <button className="btn btn-error">Close</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CarDetails;
