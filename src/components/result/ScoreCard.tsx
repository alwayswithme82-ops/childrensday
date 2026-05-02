import type { GameResult } from '../../types/game';
import { formatTime, totalHintsUsed } from '../../utils/helpers';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface Props {
  result: GameResult;
}

export function ScoreCard({ result }: Props) {
  const cfg = DIFFICULTY_CONFIG[result.difficulty];
  const hints = totalHintsUsed(result.scenes);

  return (
    <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 w-full max-w-sm">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Row label="닉네임" value={result.nickname} />
        <Row label="난이도" value={`${cfg.label}`} />
        <Row label="총 시간" value={formatTime(result.totalTimeSeconds)} />
        <Row label="별점" value={`${result.totalStars} / ${result.maxStars} ⭐`} />
        <Row label="힌트 사용" value={`${hints}회`} />
        <Row label="등급" value={result.grade} highlight />
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <>
      <span className="text-white/50">{label}</span>
      <span className={`font-bold text-right ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</span>
    </>
  );
}
