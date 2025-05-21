import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Recharts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          "https://car-rental-server-zeta.vercel.app/cars/charts",
          {
            withCredentials: false,
          }
        );

        //  console.log("Fetched data:", response.data);

        if (Array.isArray(response.data)) {
          const chartData = response.data.map((car) => ({
            name: car.model,
            price: Number(car.price) || 0,
          }));
          setData(chartData);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="px-28 py-16">
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Recharts;
