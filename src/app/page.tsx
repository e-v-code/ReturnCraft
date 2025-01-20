'use client';

import { useState, useEffect } from 'react';

interface Content {
  id: number;
  message: string;
  created_at: string;
}

export default function Home() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // 목록 불러오기
  const loadContents = async () => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) throw new Error('목록 불러오기 실패');
      const data = await response.json();
      setContents(data.contents);
    } catch (error) {
      console.error('목록 불러오기 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 목록 불러오기
  useEffect(() => {
    loadContents();
  }, []);

  // 초기화 함수
  const handleReset = () => {
    setContent('');
  };

  // 저장 함수
  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다.');
      }

      await loadContents(); // 저장 후 목록 새로고침
      setContent(''); // 입력창 초기화
    } catch (error) {
      console.error('저장 오류:', error);
    } finally {
      setSaving(false);
    }
  };

  // 클립보드 복사 함수
  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      // 1초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedId(null);
      }, 1000);
    } catch (error) {
      console.error('복사 오류:', error);
    }
  };

  // 삭제 함수
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('삭제에 실패했습니다.');
      }

      await loadContents(); // 목록 새로고침
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">에디터</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-2 border rounded"
              placeholder="내용을 입력하세요..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              초기화
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        {/* 저장된 메시지 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">저장된 메시지 목록</h2>
          <div className="space-y-4">
            {contents.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="mb-2">{item.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(item.message, item.id)}
                    className={`px-3 py-1 ${
                      copiedId === item.id
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white rounded transition-colors`}
                  >
                    {copiedId === item.id ? '복사됨!' : '복사'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            {contents.length === 0 && (
              <p className="text-gray-500 text-center py-4">저장된 메시지가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
