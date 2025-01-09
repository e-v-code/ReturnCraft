'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ApplyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 여기에 실제 API 호출 로직을 추가할 수 있습니다
      // const response = await fetch('/api/apply', { ... });
      
      alert('접수가 완료되었습니다.');
      router.push('/'); // 메인 페이지로 리다이렉트
    } catch (error) {
      console.error('접수 중 오류 발생:', error);
      alert('접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 via-purple-900 to-purple-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">피해 접수</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">이메일 주소</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">피해 내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[150px]"
                placeholder="피해 내용을 상세히 적어주세요"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              접수하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 