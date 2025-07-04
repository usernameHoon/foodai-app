/* pages/Login.jsx */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(form, setIsLoggedIn, navigate, setError);
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded shadow w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
          <form onSubmit={handleSubmit}>

            <input
              className="w-full border p-2 mb-3 rounded"
              type="email"
              name="email"
              placeholder="이메일"
              required
              onChange={handleChange}
              value={form.email}
            />

            <input
              className="w-full border p-2 mb-5 rounded"
              type="password"
              name="password"
              placeholder="비밀번호"
              required
              onChange={handleChange}
              value={form.password}
            />

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              로그인
            </button>

            {error && (
              <p className="mt-4 text-sm text-red-600 font-medium text-center">
                {error}
              </p>
            )}

          </form>
          <p className="text-center text-lg mt-4">
            아직 계정이 없으신가요? <Link to="/signup"><span className="text-blue-500">회원가입</span></Link>
          </p>
        </div>
      </main>
    </div>
  );
};
export default Login;