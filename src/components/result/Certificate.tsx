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
        className="rounded-3xl p-8 w-80 text-center shadow-2xl"
        style={{
          background: 'linear-gradient(160deg,#FFFDE7,#FCE4EC)',
          border: '4px solid #FFD93D',
        }}
      >
        <div className="text-5xl mb-3">{grade.emoji}</div>
        <h2 className="font-fredoka text-2xl mb-1" style={{ color: '#FF6B6B' }}>큐브 왕국</h2>
        <p className="text-xs mb-4" style={{ color: '#aaa' }}>클리어 인증서</p>
        <div className="py-4 my-4 flex flex-col gap-2" style={{ borderTop: '2px solid rgba(255,107,107,0.2)', borderBottom: '2px solid rgba(255,107,107,0.2)' }}>
          <p className="font-fredoka text-xl" style={{ color: '#1a1a2e' }}>{result.nickname}</p>
          <p className="text-sm" style={{ color: '#888' }}>{diff.label} 난이도 완료</p>
          <p className={`text-2xl font-black ${grade.color}`}>{result.grade}</p>
          <p className="text-xs" style={{ color: '#aaa' }}>{result.totalStars}/{result.maxStars}⭐ · {formatTime(result.totalTimeSeconds)}</p>
        </div>
        <p className="text-xs" style={{ color: '#ccc' }}>flexmathbusiness1.pages.dev</p>
      </div>
      <Button onClick={handleDownload} size="sm" variant="outline">
        📥 인증서 다운로드
      </Button>
    </div>
  );
}
