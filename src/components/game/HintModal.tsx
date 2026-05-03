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
    <Modal
      open={open}
      onClose={onClose}
      cardClassName="rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      cardStyle={{ background: '#1B2A4A', border: '1px solid rgba(245,158,11,0.25)' }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <h2 className="font-fredoka text-xl text-gold">힌트</h2>
          <span className="ml-auto text-sm text-white/40">남은 힌트: {hintsRemaining}개</span>
        </div>
        <p className="leading-relaxed text-sm text-white/80">{hintText}</p>
        <Button onClick={onClose} className="w-full">알겠어!</Button>
      </div>
    </Modal>
  );
}
