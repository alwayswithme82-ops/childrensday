import { motion } from 'framer-motion';
import type { GameResult } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';
import { Button } from '../shared/Button';
import { downloadCertificate } from '../../utils/certificate';

interface Props {
  result: GameResult;
}

const GRADE_BADGE: Record<GameResult['grade'], { icon: string; color: string }> = {
  '큐브왕': { icon: '👑', color: '#F59E0B' },
  '건축사': { icon: '🏗',  color: '#60A5FA' },
  '견습생': { icon: '🔨', color: '#9CA3AF' },
};

export function Certificate({ result }: Props) {
  const diff = DIFFICULTY_CONFIG[result.difficulty];
  const badge = GRADE_BADGE[result.grade];
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = () => downloadCertificate('certificate', `큐브왕국_${result.nickname}`);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col items-center gap-4"
    >
      {/* 인증서 본문 (html2canvas 대상) */}
      <div
        id="certificate"
        className="relative rounded-2xl overflow-hidden shrink-0"
        style={{
          width: 600,
          height: 400,
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0F172A 100%)',
          border: '4px solid #F59E0B',
        }}
      >
        {/* 모서리 장식 */}
        <span className="absolute top-4 left-4 text-gold/30 text-2xl select-none">✦</span>
        <span className="absolute top-4 right-4 text-gold/30 text-2xl select-none">✦</span>
        <span className="absolute bottom-4 left-4 text-gold/30 text-2xl select-none">✦</span>
        <span className="absolute bottom-4 right-4 text-gold/30 text-2xl select-none">✦</span>

        <div className="flex flex-col items-center justify-between h-full px-12 py-10 text-center">
          {/* 상단 타이틀 */}
          <div>
            <p className="text-xs tracking-[0.25em] text-white/40 uppercase mb-1">Certificate of Achievement</p>
            <h2 className="text-gold font-bold text-lg">🏰 큐브왕국 공인 건축가 자격증</h2>
          </div>

          {/* 중앙: 닉네임 + 등급 */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/50 text-sm">이 자격증은</p>
            <p className="text-white font-bold text-3xl tracking-wide">{result.nickname}</p>
            <p className="text-white/50 text-sm">에게 수여합니다</p>
            <div
              className="mt-2 px-4 py-1.5 rounded-full text-sm font-bold"
              style={{ background: `${badge.color}22`, color: badge.color, border: `1px solid ${badge.color}55` }}
            >
              {badge.icon} {result.grade}
            </div>
          </div>

          {/* 하단: 통계 + 날짜 */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-6 text-sm text-white/60">
              <span>{diff.label} 난이도</span>
              <span>·</span>
              <span>{formatTime(result.totalTimeSeconds)}</span>
              <span>·</span>
              <span>⭐ {result.totalStars}/{result.maxStars}</span>
            </div>
            <p className="text-xs text-white/30 mt-1">{today}</p>
          </div>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <Button onClick={handleDownload} size="sm" variant="outline">
        📥 인증서 다운로드
      </Button>
    </motion.div>
  );
}
