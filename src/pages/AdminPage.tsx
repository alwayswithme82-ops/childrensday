import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { PageTransition } from '../components/layout/PageTransition';
import type { Difficulty, LeaderboardEntry } from '../types/game';
import { DIFFICULTY_CONFIG, LEADERBOARD_KEY } from '../utils/constants';
import { formatTime } from '../utils/helpers';

const ADMIN_KEY = '큐브왕국2026';
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

function loadScores(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

function saveScores(entries: LeaderboardEntry[]) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event('storage'));
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatClock(date: Date) {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatRowTime(ts: number) {
  return new Date(ts).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [scores, setScores] = useState<LeaderboardEntry[]>(() => loadScores());
  const [qr, setQr] = useState('');
  const previousIds = useRef<Set<string>>(new Set(scores.map(s => s.id)));
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());

  const allowed = params.get('key') === ADMIN_KEY;

  useEffect(() => {
    if (allowed) return;
    const timer = window.setTimeout(() => navigate('/'), 1600);
    return () => window.clearTimeout(timer);
  }, [allowed, navigate]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const load = () => {
      const next = loadScores();
      const incoming = next.filter(s => !previousIds.current.has(s.id)).map(s => s.id);
      if (incoming.length > 0) {
        setHighlightIds(new Set(incoming));
        window.setTimeout(() => setHighlightIds(new Set()), 2200);
      }
      previousIds.current = new Set(next.map(s => s.id));
      setScores(next);
    };
    load();
    const interval = window.setInterval(load, 2000);
    window.addEventListener('storage', load);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', load);
    };
  }, [allowed]);

  useEffect(() => {
    if (!allowed) return;
    const fallback = window.location.origin || 'https://your-domain.pages.dev';
    QRCode.toDataURL(fallback, { width: 280, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [allowed]);

  const todayScores = useMemo(() => {
    const start = startOfToday();
    return scores.filter(s => s.createdAt >= start);
  }, [scores]);

  const stats = useMemo(() => {
    const avg = todayScores.length
      ? Math.round(todayScores.reduce((sum, s) => sum + s.clearTime, 0) / todayScores.length)
      : 0;
    const cubeKings = todayScores.filter(s => s.grade === '큐브왕').length;
    const byDifficulty = DIFFICULTIES.map(d => ({
      difficulty: d,
      count: todayScores.filter(s => s.difficulty === d).length,
    }));
    return { avg, cubeKings, byDifficulty };
  }, [todayScores]);

  const recent = useMemo(
    () => [...scores].sort((a, b) => b.createdAt - a.createdAt).slice(0, 20),
    [scores],
  );

  const resetToday = () => {
    const first = window.confirm('오늘 리더보드를 리셋할까요? 이 작업은 되돌릴 수 없습니다.');
    if (!first) return;
    const second = window.confirm('정말 삭제합니다. 오늘 기록만 모두 삭제할까요?');
    if (!second) return;
    const start = startOfToday();
    saveScores(scores.filter(s => s.createdAt < start));
  };

  if (!allowed) {
    return (
      <PageTransition>
        <div className="min-h-svh flex items-center justify-center bg-slate-950 px-4 text-center">
          <div>
            <p className="text-5xl mb-4">🛡</p>
            <h1 className="text-2xl font-bold text-white">접근 권한이 없습니다</h1>
            <p className="mt-2 text-sm text-slate-400">잠시 후 홈으로 이동합니다.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-svh bg-slate-950 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gold">Booth Control</p>
              <h1 className="font-fredoka text-4xl font-bold">🛡 큐브왕국 관리자</h1>
            </div>
            <div className="font-mono text-3xl font-bold text-gold">{formatClock(now)}</div>
          </header>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="오늘 총 플레이 수" value={`${todayScores.length}`} />
            <StatCard label="평균 클리어 시간" value={stats.avg ? formatTime(stats.avg) : '-'} />
            <StatCard label="큐브왕 배출 수" value={`${stats.cubeKings}`} />
            <StatCard
              label="전체 저장 기록"
              value={`${scores.length}`}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-fredoka text-3xl">실시간 리더보드</h2>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300">
                  최근 20개
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="text-sm text-slate-400">
                    <tr className="border-b border-white/10">
                      <th className="py-3">시각</th>
                      <th>닉네임</th>
                      <th>난이도</th>
                      <th>시간</th>
                      <th>등급</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(entry => (
                      <tr
                        key={entry.id}
                        className={[
                          'border-b border-white/5 text-lg transition-colors',
                          highlightIds.has(entry.id) ? 'bg-gold/20 text-gold' : 'text-slate-100',
                        ].join(' ')}
                      >
                        <td className="py-3 font-mono">{formatRowTime(entry.createdAt)}</td>
                        <td className="font-bold">{entry.nickname}</td>
                        <td>{DIFFICULTY_CONFIG[entry.difficulty].label}</td>
                        <td className="font-mono">{formatTime(entry.clearTime)}</td>
                        <td>{entry.grade}</td>
                      </tr>
                    ))}
                    {recent.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          아직 기록이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                <h2 className="font-fredoka text-3xl">난이도별 분포</h2>
                <div className="mt-5 flex flex-col gap-4">
                  {stats.byDifficulty.map(({ difficulty, count }) => {
                    const max = Math.max(...stats.byDifficulty.map(d => d.count), 1);
                    return (
                      <div key={difficulty}>
                        <div className="mb-1 flex justify-between text-sm text-slate-300">
                          <span>{DIFFICULTY_CONFIG[difficulty].label}</span>
                          <span>{count}회</span>
                        </div>
                        <div className="h-4 rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gold transition-all"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white p-5 text-center text-slate-950">
                <h2 className="font-fredoka text-3xl">QR 코드</h2>
                {qr ? <img src={qr} alt="사이트 접속 QR 코드" className="mx-auto mt-4 h-56 w-56" /> : null}
                <p className="mt-3 text-lg font-bold">이 QR을 스캔하면 집에서도 할 수 있어요!</p>
              </div>

              <div className="rounded-2xl border border-red-400/30 bg-red-950/40 p-5">
                <h2 className="font-fredoka text-3xl text-red-200">위험 구역</h2>
                <p className="mt-2 text-sm text-red-100/70">오늘 날짜의 리더보드 기록만 삭제합니다.</p>
                <button
                  type="button"
                  onClick={resetToday}
                  className="mt-4 w-full rounded-xl bg-red-500 px-4 py-3 text-lg font-bold text-white transition hover:bg-red-400"
                >
                  오늘 리더보드 리셋
                </button>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 font-mono text-4xl font-bold text-gold">{value}</p>
    </div>
  );
}
