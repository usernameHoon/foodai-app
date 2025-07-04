import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { logoutAndRedirect } from '../../utils/authUtils';

const AdminUsers = ({ setIsLoggedIn }) => {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("사용자 목록 불러오기 실패:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white px-6 py-5 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">👥 사용자 목록</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/admin" className="text-blue-600 hover:text-blue-800 hover:underline transition">
            ← 관리자 홈
          </Link>
          <button onClick={() => logoutAndRedirect(setIsLoggedIn, navigate)} className="text-red-500 hover:text-red-700 hover:underline transition">
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-600 mb-5 text-right">
          전체 사용자 수: <strong>{users.length}</strong>명
        </p>
        <div className="overflow-x-auto bg-white shadow rounded-xl">

          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">이름</th>
                <th className="py-3 px-6 text-left">이메일</th>
                <th className="py-3 px-6 text-left">가입일</th>
                <th className="py-3 px-6 text-left">권한</th>
                <th className="py-3 px-6 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 border-t">
                    <td className="py-3 px-6">{user.id}</td>
                    <td className="py-3 px-6">{user.name}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.joinDate}</td>
                    <td className="py-3 px-6">{user.role}</td>
                    <td>
                      {user.deleted ? (
                        <span className="text-red-600 py-3 px-6">탈퇴</span>
                      ) : (
                        <span className="text-green-600 py-3 px-6">정상</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-5 text-center text-gray-500">사용자 정보가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
