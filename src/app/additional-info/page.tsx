'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdditionalInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          ...formData
        })
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('추가 정보 저장 실패:', errorData);
      }
    } catch (error) {
      console.error('추가 정보 저장 실패:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">추가 정보 입력</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">이름</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">성별</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">나이</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          정보 저장
        </button>
      </form>
    </div>
  );
} 