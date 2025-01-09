'use client';

import Navbar from '@/components/Navbar';

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 via-purple-900 to-purple-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col gap-6 p-8 bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl animate-fade-in">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">
            회원가입
          </h1>
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 