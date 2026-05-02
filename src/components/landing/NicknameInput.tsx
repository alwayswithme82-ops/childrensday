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
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">

      {/* 라벨 */}
      <label className="flex items-center gap-2 text-base font-bold" style={{ color: '#FDE68A' }}>
        <span>🏷</span>
        <span>건축가 이름을 알려줘!</span>
      </label>

      {/* 입력 래퍼 */}
      <div className="relative w-full">
        {/* 배경 glow */}
        {focused && isValid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl blur-xl"
            style={{ background: 'rgba(255,215,0,0.15)', zIndex: 0 }}
          />
        )}

        <input
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="예: 큐브왕 🔮"
          maxLength={MAX_NICKNAME_LENGTH}
          className={`
            relative z-10 w-full px-6 py-4 text-xl font-bold text-center text-white rounded-2xl
            border-2 transition-all duration-200
            placeholder:text-white/25
            input-gold-focus
            ${isInvalidChar
              ? 'border-red-400/70 bg-red-950/30'
              : focused && isValid
              ? 'border-gold bg-white/8'
              : 'border-white/20 bg-white/6 hover:border-white/40 hover:bg-white/8'
            }
          `}
          style={{ backdropFilter: 'blur(12px)' }}
        />

        {/* 글자 수 */}
        <span
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold z-10 transition-colors ${
            value.length >= MAX_NICKNAME_LENGTH ? 'text-red-400' : 'text-white/30'
          }`}
        >
          {value.length}/{MAX_NICKNAME_LENGTH}
        </span>

        {/* 유효 체크 아이콘 */}
        <AnimatePresence>
          {isValid && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl z-10"
            >
              ✅
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {isInvalidChar && (
          <motion.p
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="text-red-400 text-sm font-medium flex items-center gap-1"
          >
            <span>⚠️</span> 한글, 영문, 숫자만 사용할 수 있어요!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
