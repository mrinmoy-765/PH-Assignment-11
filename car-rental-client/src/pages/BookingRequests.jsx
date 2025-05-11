import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";

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
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>
      {pendingBookings.length === 0 ? (
        <p>No pending bookings.</p>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
            <div
              key={booking._id}
              className="border p-4 rounded-md shadow-md bg-white"
            >
              <h3 className="text-lg font-bold">{booking.carInfo.model}</h3>
              <p>
                From: <strong>{booking.userInfo.fromDate}</strong>
              </p>
              <p>
                To: <strong>{booking.userInfo.toDate}</strong>
              </p>
              <p>Status: {booking.userInfo.bookingStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
