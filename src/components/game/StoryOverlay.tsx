import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../shared/Button';

interface Props {
  text: string;
  characterName: string;
  onDismiss: () => void;
  visible: boolean;
}

export function StoryOverlay({ text, characterName, onDismiss, visible }: Props) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!visible) { setDisplayed(''); return; }
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 w-full z-30 px-4 py-4"
          style={{ background: 'rgba(27,42,74,0.95)', backdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            {/* 캐릭터 원형 아바타 */}
            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-4xl shrink-0 shadow-lg">
              🧝
            </div>

            {/* 말풍선 */}
            <div className="flex-1 bg-slate-800 rounded-2xl p-4 shadow-lg">
              <p className="text-sm font-bold text-gold mb-1.5">{characterName}</p>
              <p className="text-white text-sm leading-relaxed min-h-[3rem]">{displayed}</p>
            </div>
          </div>

          {displayed.length >= text.length && (
            <div className="flex justify-end max-w-4xl mx-auto mt-3">
              <Button size="sm" onClick={onDismiss}>다음 ▶</Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
