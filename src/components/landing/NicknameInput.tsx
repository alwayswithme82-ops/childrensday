import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAX_NICKNAME_LENGTH } from '../../utils/constants';

interface Props { value: string; onChange: (v: string) => void; }
const VALID = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/;

export function NicknameInput({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const isInvalid = value.length > 0 && !VALID.test(value);
  const isValid   = value.trim().length >= 1 && !isInvalid;

  const handleChange = (v: string) => {
    if (!VALID.test(v) && v !== '') return;
    if (v.length <= MAX_NICKNAME_LENGTH) onChange(v);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <label className="text-xs font-900 uppercase tracking-widest text-gray-400">
        건축가 닉네임 ✏️
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="예: 큐브왕"
          maxLength={MAX_NICKNAME_LENGTH}
          className="w-full py-4 pl-5 pr-16 text-xl font-900 rounded-2xl outline-none transition-all duration-200"
          style={{
            fontFamily: "'Jua', sans-serif",
            background: focused ? '#FFFEF0' : '#F9FAFB',
            border: `3px solid ${isInvalid ? '#FF6B6B' : focused ? '#FFD93D' : '#E5E7EB'}`,
            boxShadow: focused
              ? `0 0 0 4px ${isInvalid ? 'rgba(255,107,107,.15)' : 'rgba(255,217,61,.25)'}`
              : '0 2px 8px rgba(0,0,0,.04)',
            color: '#1a1a2e',
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isValid && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              ✅
            </motion.span>
          )}
          <span className="text-xs font-800" style={{ color: value.length >= MAX_NICKNAME_LENGTH ? '#FF6B6B' : '#ccc' }}>
            {value.length}/{MAX_NICKNAME_LENGTH}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isInvalid && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs font-800" style={{ color: '#FF6B6B' }}>
            ⚠️ 한글·영문·숫자만 쓸 수 있어요!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
