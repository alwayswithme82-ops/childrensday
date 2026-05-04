import type { BuildRule, ColorCell, CubeColorKey, ViewFace } from '../../types/game';
import { CUBE_COLOR_HEX, CUBE_COLOR_LABEL } from '../../utils/constants';

const FACE_LABEL: Record<ViewFace, string> = {
  front: '앞에서 본 모습',
  back: '뒤에서 본 모습',
  top: '위에서 본 모습',
  left: '왼쪽에서 본 모습',
};

// 작은 2D 정사각형 — 큐브 한 칸을 도식적으로 표현.
function CubeTile({
  color,
  size = 28,
  label,
}: {
  color?: CubeColorKey | null;
  size?: number;
  label?: string;
}) {
  const bg = color ? CUBE_COLOR_HEX[color] : 'transparent';
  return (
    <div
      aria-label={label}
      className="rounded-md"
      style={{
        width: size,
        height: size,
        background: bg,
        border: color ? '1px solid rgba(255,255,255,0.45)' : '1px dashed rgba(255,255,255,0.18)',
        boxShadow: color ? 'inset 0 -3px 0 rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.3)' : 'none',
      }}
    />
  );
}

// 사용할 큐브 — 색깔별 개수 카드.
function ColorCountCards({ rules }: { rules: BuildRule[] }) {
  const counts = rules.filter(
    (r): r is Extract<BuildRule, { type: 'requiredColorCount' }> => r.type === 'requiredColorCount',
  );
  if (counts.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-300">
        🧊 사용할 큐브
      </p>
      <div className="flex flex-wrap gap-2">
        {counts.map(rule => (
          <div
            key={rule.color}
            className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2"
          >
            <CubeTile color={rule.color} size={26} label={CUBE_COLOR_LABEL[rule.color]} />
            <span className="text-sm font-bold text-white">×{rule.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// "면으로 만나기" 좋은 예시 — 두 큐브가 옆으로 나란히.
function GoodContactExample({
  colorA,
  colorB,
  count,
}: {
  colorA: CubeColorKey;
  colorB: CubeColorKey;
  count: number;
}) {
  // count=1 이면 한 쌍, count=2면 'B 가운데, A 두 개가 양 옆/위' 식으로 표시.
  const tiles =
    count >= 2
      ? (
        <div className="grid grid-cols-3 gap-1">
          <div />
          <CubeTile color={colorA} />
          <div />
          <CubeTile color={colorA} />
          <CubeTile color={colorB} />
          <div />
        </div>
      )
      : (
        <div className="flex gap-1">
          <CubeTile color={colorA} />
          <CubeTile color={colorB} />
        </div>
      );

  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
      <p className="text-xs font-bold text-emerald-200">
        ✅ {CUBE_COLOR_LABEL[colorA]}-{CUBE_COLOR_LABEL[colorB]} {count}번 만나기
      </p>
      {tiles}
      <p className="text-[11px] leading-snug text-emerald-100/85">
        옆으로 한 면이 딱 닿으면 1번 만난 거예요.
        {count >= 2 && ` ${CUBE_COLOR_LABEL[colorA]} 큐브 ${count}개가 ${CUBE_COLOR_LABEL[colorB]}와 각각 만나요.`}
      </p>
    </div>
  );
}

// "꼭짓점만 닿기"는 만남으로 세지 않는다는 안 좋은 예시 — 한 번만 보여주면 됨.
function BadContactExample({
  colorA,
  colorB,
}: {
  colorA: CubeColorKey;
  colorB: CubeColorKey;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3">
      <p className="text-xs font-bold text-red-200">❌ 꼭짓점만 닿기</p>
      <div className="grid grid-cols-2 gap-1">
        <CubeTile color={colorA} />
        <div />
        <div />
        <CubeTile color={colorB} />
      </div>
      <p className="text-[11px] leading-snug text-red-100/85">
        모서리·꼭짓점만 닿는 건 만남으로 세지 않아요.
      </p>
    </div>
  );
}

function ContactExampleCards({ rules }: { rules: BuildRule[] }) {
  const contacts = rules.filter(
    (r): r is Extract<BuildRule, { type: 'colorTouchCount' }> => r.type === 'colorTouchCount',
  );
  if (contacts.length === 0) return null;
  // 잘못된 예시는 첫 번째 접촉 규칙 색을 빌려서 한 번만 보여준다.
  const first = contacts[0];
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-300">
        🤝 어떻게 만나요?
      </p>
      <div className="flex flex-col gap-2">
        {contacts.map((rule, i) => (
          <GoodContactExample
            key={`${rule.colorA}-${rule.colorB}-${i}`}
            colorA={rule.colorA}
            colorB={rule.colorB}
            count={rule.count}
          />
        ))}
        <BadContactExample colorA={first.colorA} colorB={first.colorB} />
      </div>
    </div>
  );
}

// 어떤 격자든 3×3으로 좌상단 기준 패딩.
function normalizeTo3x3ColorGrid(grid: ColorCell[][]): ColorCell[][] {
  const out: ColorCell[][] = Array.from({ length: 3 }, () => Array<ColorCell>(3).fill(null));
  for (let r = 0; r < Math.min(grid.length, 3); r++) {
    const row = grid[r] ?? [];
    for (let c = 0; c < Math.min(row.length, 3); c++) {
      out[r][c] = row[c];
    }
  }
  return out;
}

function normalizeTo3x3ShapeGrid(grid: number[][]): number[][] {
  const out: number[][] = Array.from({ length: 3 }, () => Array<number>(3).fill(0));
  for (let r = 0; r < Math.min(grid.length, 3); r++) {
    const row = grid[r] ?? [];
    for (let c = 0; c < Math.min(row.length, 3); c++) {
      out[r][c] = row[c] ? 1 : 0;
    }
  }
  return out;
}

// 색깔 격자 한 장. 빈칸은 연한 회색으로 명확히 보이게 표시. 항상 3×3.
function ColorGrid({ cells: rawCells, cellSize = 26 }: { cells: ColorCell[][]; cellSize?: number }) {
  const cells = normalizeTo3x3ColorGrid(rawCells);
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  return (
    <div
      className="inline-grid gap-1 rounded-lg border border-slate-700 bg-slate-950/70 p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {cells.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-sm"
            style={{
              background: cell ?? 'rgba(148,163,184,0.18)',
              border: cell
                ? '1px solid rgba(255,255,255,0.45)'
                : '1px solid rgba(255,255,255,0.10)',
              boxShadow: cell ? 'inset 0 -3px 0 rgba(0,0,0,0.18)' : 'none',
            }}
          />
        )),
      )}
    </div>
  );
}

// 한 색이 N칸 보인다는 시각적 격자 (색은 알지만 위치는 예시일 뿐).
function singleColorGrid(color: CubeColorKey, count: number, face: ViewFace): ColorCell[][] {
  // 위/앞/옆 모두 1xN 정도로 표시. 4개 이상이면 세로로 쌓인 모양으로.
  const hex = CUBE_COLOR_HEX[color];
  if (face === 'top') {
    // 가로로 한 줄
    return [Array.from({ length: Math.max(count, 1) }, () => hex)];
  }
  // front/back/left: 세로로 한 줄
  return Array.from({ length: Math.max(count, 1) }, () => [hex]);
}

function emptyGrid(face: ViewFace): ColorCell[][] {
  // "안 보임"을 표현할 빈칸 격자.
  if (face === 'top') return [[null, null]];
  return [[null], [null]];
}

// 1=칸이 있어야 함, 0=없어야 함. 색깔 없이 "자리 그림"만 보여주는 격자. 항상 3×3.
function ShapeGrid({ cells: rawCells, cellSize = 26 }: { cells: number[][]; cellSize?: number }) {
  const cells = normalizeTo3x3ShapeGrid(rawCells);
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  return (
    <div
      className="inline-grid gap-1 rounded-lg border border-slate-700 bg-slate-950/70 p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {cells.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-sm"
            style={{
              background: cell ? 'rgba(226,232,240,0.85)' : 'rgba(148,163,184,0.18)',
              border: cell
                ? '1px solid rgba(255,255,255,0.6)'
                : '1px solid rgba(255,255,255,0.10)',
              boxShadow: cell ? 'inset 0 -3px 0 rgba(0,0,0,0.18)' : 'none',
            }}
          />
        )),
      )}
    </div>
  );
}

type ProjectionItem =
  | { kind: 'color'; face: ViewFace; cells: ColorCell[][]; caption: string }
  | { kind: 'shape'; face: ViewFace; cells: number[][]; caption: string };

function ProjectionCards({ rules }: { rules: BuildRule[] }) {
  const projectionFaces = new Set(
    rules
      .filter((r): r is Extract<BuildRule, { type: 'targetColorProjection' }> => r.type === 'targetColorProjection')
      .map(r => r.face),
  );
  const items: ProjectionItem[] = [];
  for (const rule of rules) {
    if (rule.type === 'targetColorProjection') {
      items.push({
        kind: 'color',
        face: rule.face,
        cells: rule.grid,
        caption: `${FACE_LABEL[rule.face]} — 이 모양이 되어야 해요.`,
      });
    } else if (rule.type === 'targetShapeProjection') {
      items.push({
        kind: 'shape',
        face: rule.face,
        cells: rule.grid,
        caption: `${FACE_LABEL[rule.face]} 자리 — 이 자리만 차지해야 해요.`,
      });
    } else if (rule.type === 'visibleColorCount') {
      items.push({
        kind: 'color',
        face: rule.face,
        cells: singleColorGrid(rule.color, rule.count, rule.face),
        caption: `${FACE_LABEL[rule.face]} ${CUBE_COLOR_LABEL[rule.color]}이 ${rule.count}개만 보여요.`,
      });
    } else if (rule.type === 'colorMustBeHiddenFrom' && !projectionFaces.has(rule.face)) {
      // 같은 면에 targetColorProjection이 있으면 거기서 이미 보여주므로 중복 카드는 생략.
      items.push({
        kind: 'color',
        face: rule.face,
        cells: emptyGrid(rule.face),
        caption: `${FACE_LABEL[rule.face]} ${CUBE_COLOR_LABEL[rule.color]}은 보이지 않아요.`,
      });
    }
  }
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-300">
        👀 어디서 보면 어떻게 보일까?
      </p>
      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-start gap-1.5">
            {item.kind === 'color'
              ? <ColorGrid cells={item.cells} />
              : <ShapeGrid cells={item.cells} />}
            <p className="max-w-[200px] text-[11px] leading-snug text-slate-200">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisualHints({ rules }: { rules: BuildRule[] }) {
  if (!rules || rules.length === 0) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      <ColorCountCards rules={rules} />
      <ContactExampleCards rules={rules} />
      <ProjectionCards rules={rules} />
    </div>
  );
}
