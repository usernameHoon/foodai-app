import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { logoutAndRedirect } from '../../utils/authUtils';

const AdminDashboard = ({ setIsLoggedIn }) => {
  const [stats, setStats] = useState({
    userCount: 0,
    analysisCount: 0,
    todayAnalysisCount: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get('http://localhost:8080/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error('API 호출 실패:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white px-6 py-5 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔧 관리자 대시보드</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline transition">메인으로</Link>
          <button onClick={() => logoutAndRedirect(setIsLoggedIn, navigate)} className="text-red-500 hover:text-red-700 hover:underline transition">로그아웃</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">📊 통계 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">총 회원 수</p>
            <p className="text-3xl font-bold text-blue-600">{stats.userCount}명</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">분석 요청 수</p>
            <p className="text-3xl font-bold text-green-600">{stats.analysisCount}건</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">금일 분석</p>
            <p className="text-3xl font-bold text-orange-500">{stats.todayAnalysisCount}건</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/admin/users" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition">회원 관리</Link>
          <Link to="/admin/logs" className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition">분석 기록</Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
