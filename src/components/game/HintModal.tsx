import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

interface Props { open: boolean; onClose: () => void; hintText: string; hintsRemaining: number; }

export function HintModal({ open, onClose, hintText, hintsRemaining }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💡</span>
          <h2 className="font-900 text-xl text-gray-800">힌트</h2>
          <span className="ml-auto text-xs font-700 text-gray-400">남은 힌트: {hintsRemaining}개</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{hintText}</p>
        <Button onClick={onClose} className="w-full">알겠어요!</Button>
      </div>
    </Modal>
  );
}
