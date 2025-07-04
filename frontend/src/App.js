// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/layouts/Header";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/userPage/MyPage';
import AdminDashboard from './pages/adminPage/AdminDashboard';
import AdminLogs from './pages/adminPage/AdminLogs';
import AdminUsers from './pages/adminPage/AdminUsers';

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const isAdminPage = location.pathname.startsWith("/admin");

  const hideHeader = isAdmin && isAdminPage;

  return (
    <>
      {!hideHeader && <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <AdminLogs isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
