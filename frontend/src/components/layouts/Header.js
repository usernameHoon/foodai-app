import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { logoutAndRedirect } from '../../utils/authUtils';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-white shadow-md border-b border-gray-200 py-6 px-8 flex justify-between items-center h-20">
      <h1 className="text-xl font-bold">
        <Link to="/" className="hover:underline text-3xl">🍽 FoodAI</Link>
      </h1>
      <nav className="flex items-center space-x-4 text-sm text-gray-700 font-medium">
        {isLoggedIn ? (
          <>
            <span className="text-xl font-bold text-green-600">
              [ {userName} ]님 환영합니다.
            </span>
            {user?.role === "ADMIN" ? (
              <Link
                to="/admin"
                className="text-xl text-gray-700 hover:text-gray-900 ml-4 hover:underline transition"
              >
                관리자 페이지
              </Link>
            ) : (
              <Link
                to="/mypage"
                className="text-xl text-gray-700 hover:text-gray-900 ml-4 hover:underline transition"
              >
                마이페이지
              </Link>
            )}
            <Link
              to="/"
              onClick={() => logoutAndRedirect(setIsLoggedIn, navigate)}
              className="text-xl text-blue-500 hover:text-blue-800 ml-4 transition"
            >
              로그아웃
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline text-xl">
              로그인
            </Link>
            <Link to="/signup" className="text-blue-500 hover:underline text-xl">
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header >
  );
};

export default Header;