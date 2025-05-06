import React from "react";

const AvailableCar = ({car}) => {

        
        const { model, price, availability, registration, features, imageUrl, location } = car;

  return (
    <div className="card w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <span className="badge badge-xs badge-success">{car.availability}</span>
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{car.model}</h2>
          <span className="text-lg">${car.price}/day</span>
        </div>
        <img src={car.imageUrl} alt="" class="w-full h-52 object-contain"/>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span><b>{car.registration}</b></span>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{car.features}</span>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 me-2 inline-block text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span class="text-blue-500">{car.location}</span>
          </li>
        </ul>
        <div className="mt-6">
          <button className="btn btn-primary btn-block">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default AvailableCar;
