import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";

const MyBookings = () => {
  const { mongoUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Slice bookings for current page
  const paginatedMyBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!mongoUser?.email) return;

    const fetchBookings = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        const res = await axios.get(
          `http://localhost:5000/bookingByEmail?email=${mongoUser.email}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [mongoUser]);

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const getTotalPrice = (fromDate, toDate, pricePerDay) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffInMs = to - from;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // round up to include partial days
    return diffInDays * parseInt(pricePerDay);
  };

  //modal for booking time update
  const openModal = (booking) => {
    setSelectedBookingId(booking._id);
    setFromDate(booking.fromDate);
    setToDate(booking.toDate);
    document.getElementById("booking_modal").showModal();
  };

  //update booking
  const handleEditBooking = async (bookingId) => {
    const updatedBooking = {
      fromDate,
      toDate,
    };

    try {
      const res = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });

      if (res.ok) {
        // alert("Booking updated!");
        // Update state
        setBookings((prev) =>
          prev.map((book) =>
            book._id === bookingId ? { ...book, fromDate, toDate } : book
          )
        );
        Swal.fire("Success!", "Your booking has been updated.", "success");
        document.getElementById("booking_modal").close();
      } else {
        // alert("Error updating booking");
        Swal.fire("Error!", "Failed to update.", "error");
        document.getElementById("booking_modal").close();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel this booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/booking/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire(
                "Cancelled!",
                "Your booking has been cancelled.",
                "success"
              );

              setBookings(bookings.filter((car) => car._id !== id));
            }
          });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A2438]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Car Image</th>
              <th className="text-center">Car Model</th>
              <th className="text-center">Booking Date</th>
              <th className="text-center">Booking Preiod</th>
              <th className="text-center">Total Price</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {paginatedMyBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No bookings found.
                </td>
              </tr>
            ) : (
             paginatedMyBookings.map((booking) => (
                <tr key={booking._id} className="hover">
                  <td>
                    <img
                      src={booking.carInfo?.image}
                      alt="car"
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>

                  <td className="text-center">
                    {booking.carInfo?.model || "N/A"}
                  </td>
                  <td className="text-center">
                    {new Date(booking.bookedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="text-center">
                    {new Date(booking.fromDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    <br /> to <br />
                    {new Date(booking.toDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="text-center">
                    {getTotalPrice(
                      booking.fromDate,
                      booking.toDate,
                      booking.carInfo.price
                    )}{" "}
                    BDT
                  </td>

                  <td className="text-center">
                    <span
                      className={`badge ${
                        booking.bookingStatus === "confirmed"
                          ? "badge-success"
                          : booking.bookigStatus === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="text-2xl"
                      onClick={() => openModal(booking)}
                    >
                      <CiEdit />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      className="text-2xl text-red-500"
                      onClick={() => handleCancel(booking._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
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

      {/* Booking Edit Modal */}
      <dialog id="booking_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Select Booking Dates</h3>

          <div className="mb-2">
            <label className="block mb-1">From:</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={fromDate.slice(0, 16)} // trims seconds for input compatibility
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">To:</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={toDate.slice(0, 16)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button
              className="btn btn-primary"
              onClick={() => handleEditBooking(selectedBookingId)}
            >
              Update Booking
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyBookings;
