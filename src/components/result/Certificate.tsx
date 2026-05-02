import { useRef } from 'react';
import type { GameResult } from '../../types/game';
import { GRADE_CONFIG, DIFFICULTY_CONFIG } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';
import { Button } from '../shared/Button';
import { downloadCertificate } from '../../utils/certificate';

interface Props {
  result: GameResult;
}

export function Certificate({ result }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const grade = GRADE_CONFIG[result.grade];
  const diff = DIFFICULTY_CONFIG[result.difficulty];

  const handleDownload = () => downloadCertificate('certificate', `큐브왕국_${result.nickname}`);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id="certificate"
        ref={certRef}
        className="bg-slate-900 border-4 border-yellow-400 rounded-3xl p-8 w-80 text-center shadow-2xl"
      >
        <div className="text-5xl mb-3">{grade.emoji}</div>
        <h2 className="text-yellow-400 font-black text-2xl mb-1">큐브 왕국</h2>
        <p className="text-white/50 text-xs mb-4">클리어 인증서</p>
        <div className="border-t border-b border-white/20 py-4 my-4 flex flex-col gap-2">
          <p className="text-white text-xl font-bold">{result.nickname}</p>
          <p className="text-white/60 text-sm">{diff.label} 난이도 완료</p>
          <p className={`text-2xl font-black ${grade.color}`}>{result.grade}</p>
          <p className="text-white/50 text-xs">{result.totalStars}/{result.maxStars}⭐ · {formatTime(result.totalTimeSeconds)}</p>
        </div>
        <p className="text-white/30 text-xs">flexmathbusiness1.pages.dev</p>
      </div>
      <Button onClick={handleDownload} size="sm" variant="secondary">
        📥 인증서 다운로드
      </Button>
    </div>
  );
}
