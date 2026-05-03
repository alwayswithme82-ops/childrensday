import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../shared/Button';
import { CHARACTER_AVATARS } from '../../data/stories';

interface Props {
  text: string;
  characterName: string;
  onDismiss: () => void;
  visible: boolean;
  buttonText?: string;
}

export function StoryOverlay({ text, characterName, onDismiss, visible, buttonText = '다음 ▶' }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const avatar = CHARACTER_AVATARS[characterName] ?? '🧝';

  useEffect(() => {
    if (!visible) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, 30);
    return () => clearInterval(timer);
  }, [text, visible]);

  const handleSkip = () => {
    if (!done) {
      setDisplayed(text);
      setDone(true);
    }
  };

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
          onClick={handleSkip}
        >
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-4xl shrink-0 shadow-lg">
              {avatar}
            </div>

            <div className="flex-1 bg-slate-800 rounded-2xl p-4 shadow-lg">
              <p className="text-sm font-bold text-gold mb-1.5">{characterName}</p>
              <p className="text-white text-sm leading-relaxed min-h-[3rem]">{displayed}</p>
              {!done && (
                <p className="text-xs text-white/30 mt-1">클릭하면 바로 넘어가요 ▶</p>
              )}
            </div>
          </div>

          {done && (
            <div className="flex justify-end max-w-4xl mx-auto mt-3" onClick={e => e.stopPropagation()}>
              <Button size="sm" onClick={onDismiss}>{buttonText}</Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
