import type { GameResult } from '../../types/game';
import { formatTime, totalHintsUsed } from '../../utils/helpers';
import { DIFFICULTY_CONFIG } from '../../utils/constants';

interface Props { result: GameResult; }

export function ScoreCard({ result }: Props) {
  const cfg = DIFFICULTY_CONFIG[result.difficulty];
  const hints = totalHintsUsed(result.scenes);

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
        <Row label="닉네임"  value={result.nickname} />
        <Row label="난이도"  value={cfg.label} />
        <Row label="총 시간" value={formatTime(result.totalTimeSeconds)} />
        <Row label="별점"    value={`${result.totalStars} / ${result.maxStars} ⭐`} />
        <Row label="힌트"    value={`${hints}회 사용`} />
        <Row label="등급"    value={result.grade} highlight />
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <>
      <span className="text-gray-400 font-700">{label}</span>
      <span className={`font-800 text-right ${highlight ? 'text-amber-500' : 'text-gray-800'}`}>{value}</span>
    </>
  );
}
