const AvailableCarTable = ({ cars }) => {
    return (
      <div className="overflow-x-auto md:px-40">
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
            {cars.map((car) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default AvailableCarTable;
