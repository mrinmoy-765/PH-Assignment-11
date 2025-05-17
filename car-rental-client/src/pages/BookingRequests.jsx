import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Swal from "sweetalert2";

const BookingRequests = () => {
  const { mongoUser, loading } = useContext(AuthContext);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(pendingBookings.length / itemsPerPage);

  // Slice bookings for current page
  const paginatedBookings = pendingBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const resCarIds = await fetch(
          `http://localhost:5000/owner-cars/${mongoUser.email}`
        );
        const carIds = await resCarIds.json();

        const resBookings = await fetch(
          "http://localhost:5000/bookings/pending",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carIds }),
            credentials: "include",
          }
        );

        const bookingsData = await resBookings.json();
        setPendingBookings(bookingsData);
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

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        setPendingBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, bookingStatus: status }
              : booking
          )
        );

        Swal.fire({
          icon: "success",
          title: `Booking ${status}`,
          text: `The booking has been successfully ${status}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the booking status. Please try again later.",
      });
    }
  };

  if (loading || isLoading) return <LoadingSpinner />;

  return (
    <div className="px-4 sm:px-10 md:px-64 pt-2 pb-10">
      <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>

      {paginatedBookings.length === 0 ? (
        <p className="text-center text-red-600">No pending bookings.</p>
      ) : (
        paginatedBookings.map((booking) => (
          <div
            key={booking._id}
            className="card w-full bg-base-100 shadow-sm mb-4"
          >
            <div className="card-body">
              <div className="flex flex-col md:flex-row justify-between gap-4">
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
                    <span
                      className={`font-extrabold ${
                        booking.bookingStatus === "pending"
                          ? "text-orange-400"
                          : booking.bookingStatus === "confirmed"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-4">
                  <div className="flex items-center justify-between gap-2 md:hidden">
                    <button
                      disabled={["confirmed", "cancelled"].includes(
                        booking.bookingStatus
                      )}
                      onClick={() =>
                        handleStatusUpdate(booking._id, "confirmed")
                      }
                      className={`flex-1 font-semibold py-1 rounded text-white ${
                        ["confirmed", "cancelled"].includes(
                          booking.bookingStatus
                        )
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Confirm
                    </button>
                    <button
                      disabled={["confirmed", "cancelled"].includes(
                        booking.bookingStatus
                      )}
                      onClick={() =>
                        handleStatusUpdate(booking._id, "cancelled")
                      }
                      className={`flex-1 font-semibold py-1 rounded text-white ${
                        ["confirmed", "cancelled"].includes(
                          booking.bookingStatus
                        )
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="hidden md:flex items-center justify-end gap-2">
                    <button
                      title="Confirm"
                      disabled={["confirmed", "cancelled"].includes(
                        booking.bookingStatus
                      )}
                      onClick={() =>
                        handleStatusUpdate(booking._id, "confirmed")
                      }
                      className={`text-xl ${
                        ["confirmed", "cancelled"].includes(
                          booking.bookingStatus
                        )
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-green-500 hover:text-green-700"
                      }`}
                    >
                      <GiConfirmed />
                    </button>
                    <button
                      title="Cancel"
                      disabled={["confirmed", "cancelled"].includes(
                        booking.bookingStatus
                      )}
                      onClick={() =>
                        handleStatusUpdate(booking._id, "cancelled")
                      }
                      className={`text-xl ${
                        ["confirmed", "cancelled"].includes(
                          booking.bookingStatus
                        )
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:text-red-700"
                      }`}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <nav className="inline-flex items-center space-x-1">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {getPages().map((page, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  currentPage === page ? "btn-primary" : "btn-outline"
                } ${page === "..." ? "cursor-default" : ""}`}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;