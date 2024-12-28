'use client';

import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 via-purple-900 to-purple-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-8 p-12 bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl animate-fade-in">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300 animate-pulse">
            ReturnCraft
          </h1>
          <h2 className="text-xl text-white/70 font-light tracking-wide animate-fade-in-up">
            당신의 새로운 여정을 시작하세요
          </h2>
        </div>
      </div>
    </div>
  );
}
