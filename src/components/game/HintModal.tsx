import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  hintText: string;
  hintsRemaining: number;
}

export function HintModal({ open, onClose, hintText, hintsRemaining }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💡</span>
          <h2 className="text-white font-bold text-xl">힌트</h2>
          <span className="ml-auto text-white/40 text-sm">남은 힌트: {hintsRemaining}개</span>
        </div>
        <p className="text-white/80 leading-relaxed text-sm">{hintText}</p>
        <Button onClick={onClose} className="w-full">알겠어요!</Button>
      </div>
    </Modal>
  );
}
