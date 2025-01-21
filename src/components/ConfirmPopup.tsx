interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmPopup({ isOpen, onClose, onConfirm }: ConfirmPopupProps) {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      onConfirm();
    } else if (e.code === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        autoFocus
      >
        <h3 className="text-lg font-semibold mb-4">확인</h3>
        <p className="mb-6">모든 메시지를 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            autoFocus
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
} 