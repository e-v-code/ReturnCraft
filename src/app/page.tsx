'use client';

import { useState, useEffect } from 'react';
import ConfirmPopup from '@/components/ConfirmPopup';

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [files, setFiles] = useState<Array<{
    id: number;
    name: string;
    uploadedAt: string;
  }>>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

  // 파일 목록 불러오기 함수
  const loadFiles = async () => {
    try {
      const response = await fetch('/api/content/files');
      if (!response.ok) throw new Error('파일 목록 불러오기 실패');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('파일 목록 불러오기 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 목록 불러오기
  useEffect(() => {
    loadContents();
    loadFiles();
  }, []);

  // 초기화 함수
  const handleReset = () => {
    setContent('');
  };

  // 저장 함수
  const handleSave = async () => {
    if (saving || !content.trim()) return; // 빈 내용이면 저장하지 않음

    try {
      setSaving(true);
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }), // content를 trim()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '저장에 실패했습니다.');
      }

      await loadContents();
      setContent('');
    } catch (error: any) {
      console.error('저장 오류:', error.message);
      alert(error.message);
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

  // handleDeleteAll 함수 수정
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/content/all', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('전체 삭제에 실패했습니다.');
      }

      await loadContents();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('전체 삭제 오류:', error);
    }
  };

  // handleKeyDown 함수 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // 기본 동작 방지
      handleSave();
    }
  };

  // handleUpload 함수 수정
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const xhr = new XMLHttpRequest();
      
      // 업로드 진행 상황 모니터링
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      // Promise로 XHR 요청 래핑
      const response = await new Promise<{ id?: number; error?: string }>((resolve, reject) => {
        xhr.open('POST', '/api/content/upload');
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      // response 타입이 명확해졌으므로 안전하게 체크 가능
      if (response.id) {
        await loadFiles();
        alert('File uploaded successfully.');
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error: any) {
      console.error('업로드 오류:', error.message);
      alert(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 파일 다운로드 함수
  const handleDownload = async (id: number, filename: string) => {
    try {
      const response = await fetch(`/api/content/download/${id}`);
      if (!response.ok) throw new Error('파일 다운로드 실패');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // handleDeleteFile 함수 추가
  const handleDeleteFile = async (id: number, filename: string) => {
    if (!confirm(`${filename} 파일을 삭제하시겠습니까?`)) return;

    try {
      const response = await fetch(`/api/content/files/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('파일 삭제 실패');
      
      await loadFiles(); // 파일 목록 새로고침
      alert('파일이 삭제되었습니다.');
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  // handleDeleteAllFiles 함수 추가
  const handleDeleteAllFiles = async () => {
    if (!confirm('모든 파일을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch('/api/content/files/all', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('파일 전체 삭제 실패');
      
      await loadFiles(); // 파일 목록 새로고침
      alert('모든 파일이 삭제되었습니다.');
    } catch (error) {
      console.error('파일 전체 삭제 오류:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4"></h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-64 p-2 border rounded"
              placeholder="(Ctrl + Enter)"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Delete All
            </button>
            <label className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer">
              Upload
              <input
                type="file"
                onChange={handleUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            <button
              onClick={handleDeleteAllFiles}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              disabled={isUploading}
            >
              Delete All Files
            </button>
          </div>
        </div>

        {/* 저장된 메시지 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4"></h2>
          <div className="space-y-4">
            {contents.map((item) => (
              <div key={item.id} className="relative p-4 bg-gray-50 rounded">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleCopy(item.message, item.id)}
                    className={`px-3 py-1 ${
                      copiedId === item.id
                        ? 'bg-gray-400 hover:bg-gray-500'
                        : 'bg-gray-400 hover:bg-gray-500'
                    } text-white rounded transition-colors text-sm`}
                  >
                    {copiedId === item.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div 
                  className="pt-8 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => handleCopy(item.message, item.id)}
                >
                  <p className="mb-2">{item.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {contents.length === 0 && (
              <p className="text-gray-500 text-center py-4">No saved messages</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold"></h2>
            <div className="flex gap-2">
              <label className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer">
                Upload
                <input
                  type="file"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <button
                onClick={handleDeleteAllFiles}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                disabled={isUploading}
              >
                Delete All Files
              </button>
            </div>
          </div>
          
          {/* 프로그레스바 */}
          {isUploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center">
                {uploadProgress}% 업로드됨
              </p>
            </div>
          )}

          {/* 기존 파일 목록 */}
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{file.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file.id, file.name)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id, file.name)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <p className="text-gray-500 text-center">No files uploaded</p>
            )}
          </div>
        </div>

        <ConfirmPopup
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDeleteAll}
        />
      </div>
    </div>
  );
}
