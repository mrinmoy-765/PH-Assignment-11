import React, { use } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const {  firebaseUser, loading } = use(AuthContext);
    // console.log(currentUser);
  const location = useLocation();
  console.log(location);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if ( firebaseUser &&  firebaseUser?.email) {
    return children;
  }
  return <Navigate state={location.pathname} to="/login"></Navigate>;

  //if-> user thake return children
  // navigate--> Login
};

export default PrivateRoute;