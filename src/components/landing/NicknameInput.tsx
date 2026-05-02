import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAX_NICKNAME_LENGTH } from '../../utils/constants';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const VALID_PATTERN = /^[가-힣a-zA-Z0-9]*$/;

export function NicknameInput({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  const isInvalidChar = value.length > 0 && !VALID_PATTERN.test(value);
  const isTooShort = value.length > 0 && value.trim().length < 1;
  const showError = isInvalidChar || isTooShort;

  const handleChange = (raw: string) => {
    if (!VALID_PATTERN.test(raw) && raw !== '') return;
    if (raw.length <= MAX_NICKNAME_LENGTH) onChange(raw);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <label className="text-slate-400 text-sm font-medium tracking-wide">
        건축가 이름을 알려줘!
      </label>

      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="건축가 이름을 알려줘!"
          maxLength={MAX_NICKNAME_LENGTH}
          className={`
            w-full px-6 py-4 text-xl font-bold text-center text-white rounded-xl outline-none
            bg-navy/50 border-2 transition-all duration-200
            placeholder:text-slate-600
            ${focused && !showError
              ? 'border-gold/80 ring-2 ring-gold/30 shadow-[0_0_16px_rgba(245,158,11,0.25)]'
              : showError
              ? 'border-red-500/80 ring-2 ring-red-500/20'
              : 'border-gold/30 hover:border-gold/50'
            }
          `}
        />
        <span
          className={`absolute right-3 bottom-2 text-xs transition-colors ${
            value.length >= MAX_NICKNAME_LENGTH ? 'text-red-400' : 'text-slate-600'
          }`}
        >
          {value.length}/{MAX_NICKNAME_LENGTH}
        </span>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-red-400 text-xs font-medium"
          >
            {isInvalidChar ? '한글, 영문, 숫자만 사용할 수 있어요!' : '한 글자 이상 입력해주세요'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
