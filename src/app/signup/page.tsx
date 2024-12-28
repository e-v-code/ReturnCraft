'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: ''
  });

  const isFormValid = formData.name && formData.gender && formData.age;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSignUp = async () => {
    try {
      // 사용자 정보를 users 테이블에 저장
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!userResponse.ok) {
        throw new Error('사용자 등록 실패');
      }

      // 로그인 로그를 login_logs 테이블에 저장
      const logResponse = await fetch('/api/login-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.name, // 또는 실제 사용자 ID
          loginTime: new Date().toISOString()
        })
      });

      if (!logResponse.ok) {
        throw new Error('로그인 로그 저장 실패');
      }

      // 메인 페이지로 이동
      router.push('/');
      
    } catch (error) {
      console.error('회원가입 처리 중 오류:', error);
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 via-purple-900 to-purple-800">
      <Navbar hideSignUp={true} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col gap-6 p-8 bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl animate-fade-in">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">
            회원가입
          </h1>
          
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-sm">이름</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-sm">성별</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="" className="text-gray-900">선택하세요</option>
                <option value="male" className="text-gray-900">남성</option>
                <option value="female" className="text-gray-900">여성</option>
                <option value="other" className="text-gray-900">기타</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-sm">나이</label>
              <input 
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                className="w-full p-3 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="나이를 입력하세요"
              />
            </div>
          </form>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <button 
            onClick={handleGoogleSignUp}
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 
              ${isFormValid 
                ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer' 
                : 'bg-purple-600/50 text-white/50 cursor-not-allowed'}`}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Google로 회원가입
          </button>
        </div>
      </div>
    </div>
  );
} 