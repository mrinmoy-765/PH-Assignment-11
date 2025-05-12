import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const BookingRequests = () => {
  const { mongoUser, loading } = useContext(AuthContext);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        // Step 1: Get all car IDs for this owner
        const resCarIds = await fetch(
          `http://localhost:5000/owner-cars/${mongoUser.email}`
        );
        const carIds = await resCarIds.json();

        console.log("car ids fetched", carIds);

        // Step 2: Get all bookings with status "pending" for those car IDs
        const resBookings = await fetch(
          "http://localhost:5000/bookings/pending",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carIds }),
          }
        );

        const bookingsData = await resBookings.json();
        setPendingBookings(bookingsData);
        console.log("Booking request fetched", bookingsData);
      } catch (err) {
        console.error("Error fetching booking requests", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (mongoUser?.email) {
      fetchBookingRequests();
    }
  }, [mongoUser?.email]);

  if (loading || isloading) return <LoadingSpinner />;

  return (
    <div className="px-4 sm:px-10 md:px-64 pt-2 pb-10">
      <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>
      {pendingBookings.length === 0 ? (
        <p className="text-center text-red-600">No pending bookings.</p>
      ) : (
        pendingBookings.map((booking) => (
          <div
            key={booking._id}
            className="card w-full bg-base-100 card-md shadow-sm mb-4"
          >
            <div className="card-body">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Car and date info */}
                <div className="flex-1">
                  <h2 className="card-title">{booking.carInfo.model}</h2>
                  <p>
                    From:{" "}
                    <strong>
                      {new Date(booking.fromDate).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        hour12: true,
                      })}
                    </strong>
                    <br />
                    To:{" "}
                    <strong>
                      {new Date(booking.toDate).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        hour12: true,
                      })}
                    </strong>
                    <br />
                    Status:{" "}
                    <span className="text-orange-400 font-extrabold">
                      {booking.bookingStatus}
                    </span>
                  </p>
                </div>

                {/* Buttons and user info */}
                <div className="flex flex-col md:items-end justify-between gap-4">
                  {/* Mobile buttons */}
                  <div className="flex items-center justify-between gap-2 md:hidden">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded">
                      Confirm
                    </button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 rounded">
                      Cancel
                    </button>
                  </div>

                  {/* Desktop icons */}
                  <div className="hidden md:flex items-center justify-end gap-2">
                    <button
                      title="Confirm"
                      className="text-xl text-green-500 hover:text-green-700"
                    >
                      <GiConfirmed />
                    </button>
                    <button
                      title="Cancel"
                      className="text-xl text-red-500 hover:text-red-700"
                    >
                      <MdOutlineCancel />
                    </button>
                  </div>

                  <div>
                    <p className="flex items-center gap-2 text-cyan-400">
                      <FaUser />
                      {booking.userInfo.name}
                    </p>
                    <p className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                      <MdEmail />
                      {booking.userInfo.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingRequests;
