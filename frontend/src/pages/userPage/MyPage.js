import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Modal } from '../Modal'; // Chart.js 모달 컴포넌트

const MyPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/food-analysis/my', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setHistory(res.data);
      } catch (err) {
        console.error("분석 이력 불러오기 실패", err);
      }
    };

    fetchHistory();
  }, []);

  const handleViewResult = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/food-analysis/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setSelectedResult(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("결과 불러오기 실패", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmDelete) return;

    try {
      await await axios.delete('http://localhost:8080/api/withdraw', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("회원 탈퇴 실패", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  // 페이징 처리 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">마이페이지 </h2>

        <div className="mb-6 text-right">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
          >
            ← 홈으로 이동
          </Link>
        </div>

        <section className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h3 className="text-xl font-semibold mb-4">👤 사용자 정보</h3>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">이메일: </span>{user?.email}</p>
            <p><span className="font-medium">이름: </span>{user?.name}</p>
          </div>

          <div className="mt-6 border-t pt-4 text-right">
            <p className="text-sm text-gray-500 mb-2">
              회원 탈퇴 시 모든 정보가 삭제되며 복구되지 않습니다.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-800 hover:underline text-sm"
            >
              회원 탈퇴
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-6">📊 분석 이력</h3>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-6">분석 이력이 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {currentItems.map(({ id, label, analyzedAt }) => (
                  <li
                    key={id}
                    className="border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
                  >
                    <span className="text-gray-800">
                      🍽 {label.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                      <span className="text-sm text-gray-500 ml-2">({analyzedAt})</span>
                    </span>
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline transition text-sm"
                      onClick={() => handleViewResult(id)}
                    >
                      결과 보기
                    </button>
                  </li>
                ))}
              </ul>

              {/* 페이지네이션 */}
              <div className="flex justify-center items-center gap-2 mt-6">
                {/* 이전 버튼 */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition 
                  ${currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-white hover:bg-blue-500'}`}
                >
                  <span>←</span>
                  <span>이전</span>
                </button>

                {/* 현재 페이지 표시 */}
                <span className="px-3 py-1 rounded-full text-blue-700 text-sm font-medium bg-slate-100">
                  {currentPage}
                </span>

                {/* 다음 버튼 */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition 
                  ${currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-white hover:bg-blue-500'}`}
                >
                  <span>다음</span>
                  <span>→</span>
                </button>
              </div>

            </>
          )}
        </section>

        {/* 모달 */}
        {showModal && selectedResult && (
          <Modal
            data={selectedResult}
            onClose={() => {
              setShowModal(false);
              setSelectedResult(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default MyPage;
