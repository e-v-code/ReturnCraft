'use client';

import { useState, useEffect } from 'react';

interface FileInfo {
  name: string;
  size: number;
  uploadedAt: string;
}

interface FileListProps {
  onFileLoad: (content: string) => void;
  onFileUpload?: number;
}

export default function FileList({ onFileLoad, onFileUpload }: FileListProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // 파일 목록 불러오기
  const loadFileList = async () => {
    try {
      setLoading(true);
      console.log('파일 목록 불러오기 시작');
      
      const response = await fetch('/api/content');
      console.log('API 응답:', response);
      
      if (response.ok) {
        const data = await response.json();
        console.log('받은 데이터:', data);
        
        if (data.files && Array.isArray(data.files)) {
          setFiles(data.files);
        } else {
          console.error('files 데이터가 없거나 배열이 아님:', data);
          setFiles([]);
        }
      } else {
        console.error('API 응답 실패:', response.status);
        setFiles([]);
      }
    } catch (error) {
      console.error('파일 목록 로드 중 오류:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // 파일 내용 불러오기
  const handleLoadFile = async (fileName: string) => {
    try {
      // txt 파일인 경우에만 불러오기 기능 활성화
      if (!fileName.toLowerCase().endsWith('.txt')) {
        alert('텍스트 파일(.txt)만 불러올 수 있습니다.');
        return;
      }

      const response = await fetch(`/api/content?fileName=${fileName}`);
      if (response.ok) {
        const data = await response.json();
        onFileLoad(data.content); // 에디터 박스에 내용 설정
        alert('파일 내용을 불러왔습니다.');
      } else {
        alert('파일을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('파일 불러오기 중 오류:', error);
      alert('파일 불러오기 중 오류가 발생했습니다.');
    }
  };

  // 파일 다운로드
  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/contents/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 파일 삭제
  const handleDeleteFile = async (fileName: string) => {
    if (!confirm('정말 이 파일을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/content/files/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('파일 삭제 실패');
      }
      
      await loadFileList();
      alert('파일이 삭제되었습니다.');
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트 마운트 시와 파일 업로드 시 목록 새로고침
  useEffect(() => {
    console.log('useEffect 실행 - uploadCount:', onFileUpload);
    loadFileList();
  }, [onFileUpload]);

  if (loading) {
    return <div className="text-center py-4">파일 목록을 불러오는 중...</div>;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">파일 목록</h3>
        <button
          onClick={loadFileList}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          새로고침
        </button>
      </div>
      <div className="space-y-2">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(file.uploadedAt).toLocaleString()} - {(file.size / 1024).toFixed(2)}KB
                </p>
              </div>
              <div className="flex gap-2">
                {file.name.toLowerCase().endsWith('.txt') && (
                  <button
                    onClick={() => handleLoadFile(file.name)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    불러오기
                  </button>
                )}
                <button
                  onClick={() => handleDownload(file.name)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  다운로드
                </button>
                <button
                  onClick={() => handleDeleteFile(file.name)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">저장된 파일이 없습니다.</p>
        )}
      </div>
    </div>
  );
} 