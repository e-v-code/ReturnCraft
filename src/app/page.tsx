'use client';

import { useState, useRef } from 'react';
import FileList from '@/components/FileList';

export default function Home() {
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/content', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setContent(data.content);
        }
        setUploadCount(prev => prev + 1); // 업로드 카운트 증가
        alert('파일이 업로드되었습니다.');
      }
    } catch (error) {
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setUploadCount(prev => prev + 1); // 저장 후 목록 새로고침
        alert('내용이 저장되었습니다.');
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">텍스트 에디터</h1>
        
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-2 border rounded"
            placeholder="내용을 입력하세요..."
          />
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? '업로드 중...' : '파일 업로드'}
          </button>
        </div>

        <FileList 
          onFileLoad={setContent}
          onFileUpload={uploadCount}
        />
      </div>
    </div>
  );
}
