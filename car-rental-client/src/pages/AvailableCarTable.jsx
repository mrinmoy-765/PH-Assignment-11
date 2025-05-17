import { Link } from "react-router-dom";
import { useState } from "react";

const AvailableCarTable = ({ cars }) => {

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  // Slice bookings for current page
  const paginatedCars= cars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


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


  return (
    <div className="overflow-x-auto md:px-30">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Image</th>
            <th className="text-center">Model</th>
            <th className="text-center">Features</th>
            <th className="text-center">Price (per day)</th>
            <th className="text-center">Availability</th>
            <th className="text-center">Location</th>
          </tr>
        </thead>
        <tbody className="text-center">
          { paginatedCars.map((car) => (
            <tr key={car._id}>
              <td className="p-2">
                <img
                  src={car.imageUrl}
                  alt={car.model}
                  className="w-20 h-14 object-cover rounded"
                />
              </td>
              <td>{car.model}</td>
              <td>{car.features}</td>
              <td>{car.price}</td>
              <td>
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
              <td>{car.location}</td>
              <td>
                <span className="px-2 py-1 rounded text-xs text-white bg-blue-400 hover:bg-blue-600">
                  <Link to={`/details/${car._id}`}>Boook Now</Link>
                </span>
              </td>
            </tr>
          ))}
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

export default AvailableCarTable;
