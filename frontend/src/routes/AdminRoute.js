import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  return token && user?.role === "ADMIN" ? children : <Navigate to="/" replace />;
};

export default AdminRoute;