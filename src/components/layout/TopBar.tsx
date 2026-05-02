import { useNavigate } from 'react-router-dom';
import { MuteToggle } from '../shared/MuteToggle';
import { motion } from 'framer-motion';

interface Props { showBack?: boolean; }

export function TopBar({ showBack = true }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/')}
            className="text-sm font-700 text-gray-400 hover:text-gray-700 transition-colors">
            ← 처음으로
          </motion.button>
        )}
        <span className="font-900 text-amber-500 text-lg">🧊 큐브왕국</span>
      </div>
      <MuteToggle />
    </div>
  );
}
