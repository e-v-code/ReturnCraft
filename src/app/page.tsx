'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // 초기화 함수
  const handleReset = () => {
    setContent('');
  };

  // 저장 함수
  const handleSave = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setHasFile(true);
        alert('저장되었습니다.');
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 불러오기 함수
  const handleLoad = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        alert('불러왔습니다.');
      } else {
        alert('불러오기 실패');
      }
    } catch (error) {
      console.error('불러오기 오류:', error);
      alert('불러오는 중 오류가 발생했습니다.');
    }
  };

  // 파일 업로드 함수
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFileUrl(data.fileUrl);
        setUploadedFileName(data.fileName);
        alert('파일이 업로드되었습니다.');
      } else {
        alert('파일 업로드 실패');
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  // 파일 다운로드 함수
  const handleFileDownload = () => {
    if (!uploadedFileUrl) return;
    window.open(uploadedFileUrl, '_blank');
  };

  // 컴포넌트 마운트 시 파일 존재 여부 확인
  useEffect(() => {
    const checkFileExists = async () => {
      try {
        const response = await fetch('/api/content/exists');
        if (response.ok) {
          const data = await response.json();
          setHasFile(data.exists);
        }
      } catch (error) {
        console.error('파일 존재 확인 오류:', error);
      }
    };
    checkFileExists();
  }, []);

  // 컴포넌트 마운트 시 업로드된 파일 확인
  useEffect(() => {
    const checkUploadedFile = async () => {
      try {
        const response = await fetch('/api/upload/exists');
        if (response.ok) {
          const data = await response.json();
          setUploadedFileUrl(data.fileUrl);
          setUploadedFileName(data.fileName);
        }
      } catch (error) {
        console.error('업로드된 파일 확인 오류:', error);
      }
    };
    checkUploadedFile();
  }, []);

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
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            초기화
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장하기
          </button>
          <button
            onClick={handleLoad}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={!hasFile}
          >
            불러오기
          </button>
        </div>
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">파일 업로드</h2>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              파일 업로드
            </button>
            {uploadedFileUrl && (
              <>
                <button
                  onClick={handleFileDownload}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  다운로드
                </button>
                <span className="ml-2 text-gray-600">
                  업로드된 파일: {uploadedFileName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
