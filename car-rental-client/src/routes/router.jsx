import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../components/notFound";
import AddCar from "../pages/AddCar";
import MyCars from "../pages/MyCars";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/addCar",
        element: <AddCar></AddCar>,
      },
      {
        path: "/my-cars",
        element: <MyCars></MyCars>,
      },
    ],
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
