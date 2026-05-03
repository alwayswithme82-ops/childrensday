import { motion } from 'framer-motion';
import type { GameResult } from '../../types/game';
import { formatTime, totalHintsUsed } from '../../utils/helpers';
import { DIFFICULTY_CONFIG, GRADE_CONFIG } from '../../utils/constants';

interface Props {
  result: GameResult;
}

interface RowProps {
  label: string;
  children: React.ReactNode;
}

function Row({ label, children }: RowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      <div className="font-bold text-sm">{children}</div>
    </div>
  );
}

function DiffBadge({ difficulty }: { difficulty: GameResult['difficulty'] }) {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${cfg.color} ${cfg.ring}`}>
      {cfg.label}
    </span>
  );
}

function GradeBadge({ grade }: { grade: GameResult['grade'] }) {
  const cfg = GRADE_CONFIG[grade];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-current ${cfg.color}`}>
      {cfg.emoji} {grade}
    </span>
  );
}

export function ScoreCard({ result }: Props) {
  const hints = totalHintsUsed(result.scenes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-md mx-auto rounded-2xl p-8 backdrop-blur-md"
      style={{ background: 'rgba(27,42,74,0.80)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">결과 요약</h3>

      <Row label="닉네임">
        <span className="text-white">{result.nickname}</span>
      </Row>

      <Row label="난이도">
        <DiffBadge difficulty={result.difficulty} />
      </Row>

      <Row label="클리어 시간">
        <span className="text-white font-mono">{formatTime(result.totalTimeSeconds)}</span>
      </Row>

      <Row label="별점">
        <span className="text-gold">
          ⭐ {result.totalStars} / {result.maxStars}
        </span>
      </Row>

      <Row label="힌트 사용">
        <span className="text-white">💡 {hints}회</span>
      </Row>

      <Row label="등급">
        <GradeBadge grade={result.grade} />
      </Row>
    </motion.div>
  );
}
