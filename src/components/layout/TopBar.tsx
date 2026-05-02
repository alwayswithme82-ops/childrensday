import { useNavigate } from 'react-router-dom';
import { MuteToggle } from '../shared/MuteToggle';
import { motion } from 'framer-motion';

interface Props {
  showBack?: boolean;
}

export function TopBar({ showBack = true }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← 처음으로
          </motion.button>
        )}
        <span className="font-bold text-yellow-400 text-lg">🧊 큐브 왕국</span>
      </div>
      <MuteToggle />
    </div>
  );
}
