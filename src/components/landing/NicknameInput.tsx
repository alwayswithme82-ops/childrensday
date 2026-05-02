import { useState } from 'react';
import { MAX_NICKNAME_LENGTH } from '../../utils/constants';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function NicknameInput({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const isValid = value.trim().length >= 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-white/70 text-sm font-medium">닉네임을 입력해주세요</label>
      <div
        className={`relative transition-all duration-200 ${focused && isValid ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]' : ''}`}
      >
        <input
          type="text"
          maxLength={MAX_NICKNAME_LENGTH}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="예: 큐브왕"
          className="bg-white/10 border-2 border-white/20 focus:border-yellow-400 text-white text-center text-xl font-bold rounded-xl px-6 py-3 outline-none w-48 transition-colors placeholder:text-white/30"
        />
        <span className="absolute -bottom-6 right-0 text-xs text-white/40">
          {value.length}/{MAX_NICKNAME_LENGTH}
        </span>
      </div>
      {value.length > 0 && !isValid && (
        <p className="text-red-400 text-xs mt-1">한 글자 이상 입력해주세요</p>
      )}
    </div>
  );
}
