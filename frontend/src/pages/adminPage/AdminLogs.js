import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { logoutAndRedirect } from '../../utils/authUtils';

const AdminLogs = ({ setIsLoggedIn }) => {

  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get('http://localhost:8080/api/admin/logs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 상단 헤더 */}
      <header className="bg-white px-6 py-5 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">📑 분석 기록</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/admin"
            className="text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            ← 관리자 홈
          </Link>
          <button
            onClick={() => logoutAndRedirect(setIsLoggedIn, navigate)}
            className="text-red-500 hover:text-red-700 hover:underline transition"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 본문 테이블 */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="text-left px-6 py-3">No</th>
                <th className="text-left px-6 py-3">사용자</th>
                <th className="text-left px-6 py-3">이미지명</th>
                <th className="text-left px-6 py-3">분석결과</th>
                <th className="text-left px-6 py-3">날짜</th>
                <th className="text-left px-6 py-3">회원상태</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-3">분석 기록이 없습니다.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-3">{log.id}</td>
                    <td className="px-6 py-3">{log.userEmail}</td>
                    <td className="px-6 py-3">{log.image || '없음'}</td>
                    <td className="px-6 py-3">{log.label}</td>
                    <td className="px-6 py-3">{new Date(log.analyzedAt).toLocaleString()}</td>
                    <td>
                      {log.userDeleted ? (
                        <span className="text-red-600 py-3 px-6">탈퇴</span>
                      ) : (
                        <span className="text-green-600 py-3 px-6">정상</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminLogs;
