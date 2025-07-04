import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Modal } from './Modal';

const Home = ({ isLoggedIn }) => {
  const [role, setRole] = useState(null);
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setRole(user.role);
      } catch (e) {
        setRole(null);
      }
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const result = response.data;

      setAnalysisResult(result);
      setShowModal(true);

      result.image = file.name;

      await axios.post('http://localhost:8080/api/food-analysis', result, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error(error);
      alert("분석 실패");
    }
  };


  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <h2 className="text-3xl font-bold mb-6">음식 사진으로 칼로리와 영양소를 분석하세요!</h2>

        {!isLoggedIn && (
          <Link
            to="/login"
            className=" text-blue-500 px-4 py-2 rounded hover:text-blue-600 transition"
          >
            로그인 후 시작하세요.
          </Link>
        )}

        {(isLoggedIn && (role === 'USER' || role === 'ADMIN')) && (
          <form
            className="bg-white p-6 rounded shadow-md w-full max-w-md mt-9"
            onSubmit={handleSubmit}
          >
            <label className="block mb-2 font-semibold">사진 업로드</label>
            <input type="file" accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border p-2 mb-4 rounded"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              분석 시작하기
            </button>
          </form>
        )}

        {showModal && analysisResult && (
          <Modal data={analysisResult} onClose={() => setShowModal(false)} />
        )}
      </main>
    </div>
  );
};

export default Home;
