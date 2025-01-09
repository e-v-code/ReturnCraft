'use client';

import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 via-purple-900 to-purple-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-8 p-12 bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl animate-fade-in">
          <h1 className="text-6xl font-bold relative">
            <span className="relative text-white">
              MGTECH
              <span className="absolute left-0 top-1/2 w-full h-0.5 bg-red-500 transform -translate-y-1/2"></span>
            </span>
          </h1>
          <h2 className="text-xl text-white/70 font-light tracking-wide animate-fade-in-up">
          엠지텍 제품 사용으로 피해보신 분의 접수를 받습니다
          </h2>
        </div>
      </div>
    </div>
  );
}
