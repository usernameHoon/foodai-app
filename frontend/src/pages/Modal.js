import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export const Modal = ({ onClose, data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // 색상 배열 정의
    const backgroundColors = [
      'rgba(255, 159, 64, 0.6)',   // 칼로리 - 주황
      'rgba(255, 205, 86, 0.6)',   // 탄수화물 - 노랑
      'rgba(255, 99, 132, 0.6)',   // 지방 - 분홍
      'rgba(75, 192, 192, 0.6)',   // 단백질 - 청록
      'rgba(54, 162, 235, 0.6)',   // 나트륨 - 파랑
      'rgba(153, 102, 255, 0.6)'   // 당류 - 보라
    ];

    const borderColors = [
      'rgba(255, 159, 64, 1)',
      'rgba(255, 205, 86, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(153, 102, 255, 1)'
    ];

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const formattedLabel = data.label
      .replaceAll("_", " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    chartInstanceRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: ["칼로리", "탄수화물", "지방", "단백질", "나트륨", "당류"],
        datasets: [{
          label: "영양 성분 (g / kcal / mg)",
          data: [
            data.calories,
            data.carbohydrates,
            data.fats,
            data.protein,
            data.sodium,
            data.sugars
          ],
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          fill: chartType === "radar" || chartType === "line"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: `음식 영양 분석 결과 / ${data.weight}g 기준`
          }
        },
        scales: chartType === "bar" || chartType === "line" ? {
          y: { beginAtZero: true }
        } : {}
      }
    });
  }, [data, chartType]);

  const formattedLabel = data.label
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg relative w-[90%] max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          X
        </button>

        {/* 🍽 음식 이름 + 중량 표시 */}
        <h3 className="text-xl font-semibold text-center mb-2">
          🍽 {formattedLabel}
        </h3>

        {/* 📷 음식 이미지 */}
        {data.imageUrl && (
          <div className="flex justify-center mb-3">
            <img
              src={data.imageUrl}
              alt="예측된 음식"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        {/* 📊 차트 타입 선택 */}
        <div className="text-center mb-2">
          <label className="mr-2 font-medium">차트 타입:</label>
          <select
            value={chartType}
            onChange={e => setChartType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="bar">Bar</option>
            <option value="radar">Radar</option>
            <option value="line">Line</option>
            <option value="doughnut">Doughnut</option>
          </select>
        </div>

        {/* 차트 */}
        <canvas id="resultChart" ref={chartRef} width="400" height="300" />

        {/* 📋 영양 성분 상세 수치 표 */}
        <div className="mt-4">
          <table className="w-full text-sm text-left border-t pt-2">
            <tbody>
              <tr><td className="font-semibold py-1">칼로리</td><td>{data.calories} kcal</td></tr>
              <tr><td className="font-semibold py-1">탄수화물</td><td>{data.carbohydrates} g</td></tr>
              <tr><td className="font-semibold py-1">지방</td><td>{data.fats} g</td></tr>
              <tr><td className="font-semibold py-1">단백질</td><td>{data.protein} g</td></tr>
              <tr><td className="font-semibold py-1">나트륨</td><td>{data.sodium} mg</td></tr>
              <tr><td className="font-semibold py-1">당류</td><td>{data.sugars} g</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
