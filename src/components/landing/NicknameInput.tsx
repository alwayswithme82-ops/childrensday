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
  const isInvalidChar = value.length > 0 && !VALID.test(value);
  const isValid = value.trim().length >= 1 && VALID.test(value);

  const handleChange = (raw: string) => {
    if (!VALID.test(raw) && raw !== '') return;
    if (raw.length <= MAX_NICKNAME_LENGTH) onChange(raw);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <label
        className="text-xs font-black uppercase tracking-widest"
        style={{ color: 'rgba(180,83,9,0.6)' }}
      >
        건축가 닉네임
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
          className="w-full py-4 pl-5 pr-16 text-xl font-black rounded-2xl outline-none transition-all duration-200"
          style={{
            background: focused ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
            border: `2px solid ${
              isInvalidChar
                ? '#EF4444'
                : focused && isValid
                ? '#D97706'
                : 'rgba(180,130,0,0.20)'
            }`,
            color: '#1C1917',
            boxShadow: focused && isValid
              ? '0 0 0 4px rgba(217,119,6,0.12)'
              : focused
              ? '0 0 0 4px rgba(180,130,0,0.08)'
              : 'none',
          }}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isValid && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg">
              ✅
            </motion.span>
          )}
          <span
            className="text-xs font-bold"
            style={{ color: value.length >= MAX_NICKNAME_LENGTH ? '#EF4444' : 'rgba(0,0,0,0.25)' }}
          >
            {value.length}/{MAX_NICKNAME_LENGTH}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isInvalidChar && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-bold"
            style={{ color: '#EF4444' }}
          >
            ⚠ 한글·영문·숫자만 입력할 수 있어요
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
