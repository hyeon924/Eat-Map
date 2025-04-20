import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-blue-600 text-2xl font-bold text-center">
          🍽 전국 맛집 지도 서비스
        </h1>

        <div className="flex gap-4">
          <select className="border px-4 py-2 rounded">
            <option>서울</option>
            <option>부산</option>
            <option>대전</option>
            <option>대구</option>
          </select>

          <select className="border px-4 py-2 rounded">
            <option>한식</option>
            <option>중식</option>
            <option>일식</option>
            <option>양식</option>
          </select>

          <button className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600">
            검색
          </button>
        </div>
      </div>
    </div>
  );
}


export default App;
