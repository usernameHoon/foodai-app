import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signupUser } from "../services/authService";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    signupUser(form, navigate, setError);
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded shadow w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="이름" className="w-full border p-2 mb-3 rounded" required onChange={handleChange}
              value={form.name} />
            <input type="email" name="email" placeholder="이메일" className="w-full border p-2 mb-3 rounded" required onChange={handleChange}
              value={form.email} />
            <input type="password" name="password" placeholder="비밀번호" className="w-full border p-2 mb-3 rounded" required onChange={handleChange}
              value={form.password} />
            <input type="password" name="confirmPassword" placeholder="비밀번호 확인" className="w-full border p-2 mb-5 rounded" required onChange={handleChange}
              value={form.confirmPassword} />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">회원가입</button>
            {error && (
              <p className="mt-4 text-sm text-red-600 font-medium text-center">
                {error}
              </p>
            )}
          </form>
          <p className="text-center text-lg mt-4">
            이미 계정이 없으신가요? <Link to="/login"><span className="text-blue-500">로그인</span></Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;