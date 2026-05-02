import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../shared/Button';

interface Props { text: string; characterName: string; onDismiss: () => void; visible: boolean; }

export function StoryOverlay({ text, characterName, onDismiss, visible }: Props) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!visible) { setDisplayed(''); return; }
    setDisplayed('');
    let i = 0;
    const t = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, 28);
    return () => clearInterval(t);
  }, [text, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="absolute bottom-0 left-0 right-0 z-20 p-4"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧝</span>
              <span className="font-800 text-amber-600 text-sm">{characterName}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed min-h-[44px]">{displayed}</p>
            {displayed.length >= text.length && (
              <div className="flex justify-end mt-3">
                <Button size="sm" onClick={onDismiss}>다음 ▶</Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
