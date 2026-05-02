import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAX_NICKNAME_LENGTH } from '../../utils/constants';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const VALID = /^[가-힣a-zA-Z0-9]*$/;

export function NicknameInput({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const isInvalid = value.length > 0 && !VALID.test(value);
  const isValid = value.trim().length >= 1 && !isInvalid;

  const handleChange = (v: string) => {
    if (!VALID.test(v) && v !== '') return;
    if (v.length <= MAX_NICKNAME_LENGTH) onChange(v);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-800 text-gray-400 uppercase tracking-widest">
        닉네임
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
          className="w-full py-3.5 pl-4 pr-20 text-lg font-800 rounded-xl transition-all duration-150 outline-none"
          style={{
            border: `2px solid ${isInvalid ? '#EF4444' : focused ? '#F59E0B' : '#E5E7EB'}`,
            boxShadow: focused ? `0 0 0 4px ${isInvalid ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.12)'}` : 'none',
            background: '#fff',
            color: '#111827',
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isValid && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✅</motion.span>}
          <span className="text-xs font-700" style={{ color: value.length >= MAX_NICKNAME_LENGTH ? '#EF4444' : '#9CA3AF' }}>
            {value.length}/{MAX_NICKNAME_LENGTH}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isInvalid && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs font-700 text-red-500">
            ⚠ 한글·영문·숫자만 입력할 수 있어요
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
