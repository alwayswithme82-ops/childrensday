import type { GameResult } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';
import { Button } from '../shared/Button';
import { downloadCertificate } from '../../utils/certificate';

const GRADE_EMOJI: Record<string, string> = { '큐브왕': '🏆', '건축사': '🏗', '견습생': '🔨' };

export function Certificate({ result }: { result: GameResult }) {
  const diff = DIFFICULTY_CONFIG[result.difficulty];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        id="certificate"
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{
          background: 'linear-gradient(160deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '3px solid #F59E0B',
          boxShadow: '0 8px 32px rgba(245,158,11,0.2)',
        }}
      >
        <div className="text-5xl mb-2">{GRADE_EMOJI[result.grade]}</div>
        <h2 className="text-2xl font-900 text-amber-600 mb-1">큐브왕국</h2>
        <p className="text-xs font-700 text-amber-400 uppercase tracking-widest mb-5">클리어 인증서</p>
        <div className="border-t border-b border-amber-200 py-4 my-3 flex flex-col gap-1.5">
          <p className="text-2xl font-900 text-gray-800">{result.nickname}</p>
          <p className="text-sm font-600 text-gray-500">{diff.label} 난이도 완주</p>
          <p className="text-3xl font-900 text-amber-500 my-1">{result.grade}</p>
          <p className="text-xs font-700 text-gray-400">
            {result.totalStars}/{result.maxStars}⭐ · {formatTime(result.totalTimeSeconds)}
          </p>
        </div>
        <p className="text-xs text-gray-300">flexmathbusiness1.pages.dev</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => downloadCertificate('certificate', `큐브왕국_${result.nickname}`)}>
        📥 인증서 다운로드
      </Button>
    </div>
  );
}
