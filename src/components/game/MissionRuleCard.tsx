import type { Scene } from '../../types/game';
import type { RuleResult } from '../../utils/buildValidation';
import { VisualHints } from './VisualHints';

interface Props {
  scene: Scene;
  results: RuleResult[];
  currentCubes: number;
}

export function MissionRuleCard({ scene, results, currentCubes }: Props) {
  return (
    <div className="rounded-2xl border border-amber-300/30 bg-slate-900/85 p-4 shadow-lg">
      {scene.memo && (
        <div
          className="rounded-2xl border-2 border-amber-200/60 px-4 py-3 text-amber-100"
          style={{
            background:
              'linear-gradient(160deg, rgba(120,80,30,0.55) 0%, rgba(80,55,20,0.7) 100%)',
            boxShadow: 'inset 0 0 14px rgba(0,0,0,0.35)',
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-200/80">
            📜 큐브왕의 메모
          </p>
          <p className="mt-2 whitespace-pre-line text-sm font-bold leading-relaxed">
            {scene.memo}
          </p>
        </div>
      )}

      <VisualHints rules={scene.rules ?? []} />

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gold">조건 체크</p>
      <ul className="mt-2 space-y-1.5">
        {results.length === 0 && (
          <li className="text-sm text-slate-400">규칙이 없는 미션이에요.</li>
        )}
        {results.map((r, i) => (
          <li
            key={i}
            className={[
              'flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm',
              r.ok
                ? 'bg-emerald-500/15 text-emerald-100'
                : 'bg-slate-950/60 text-slate-200',
            ].join(' ')}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{r.ok ? '✅' : '⬜'}</span>
              <span className="font-bold">{r.label}</span>
            </span>
            <span className="text-xs font-bold text-slate-300">
              {String(r.current)} / {String(r.target)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-xl bg-gold/10 px-3 py-2 text-sm font-bold text-gold">
        지금 쌓은 큐브: {currentCubes}개
      </div>
    </div>
  );
}
