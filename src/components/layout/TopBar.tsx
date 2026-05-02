import { useNavigate } from 'react-router-dom';
import { MuteToggle } from '../shared/MuteToggle';
import { motion } from 'framer-motion';

interface Props {
  showBack?: boolean;
}

export function TopBar({ showBack = true }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderColor: 'rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="text-sm font-fredoka transition-colors"
            style={{ color: '#FF6B6B' }}
          >
            ← 처음으로
          </motion.button>
        )}
        <span className="font-fredoka text-lg" style={{ color: '#4D96FF' }}>🧊 큐브 왕국</span>
      </div>
      <MuteToggle />
    </div>
  );
}
