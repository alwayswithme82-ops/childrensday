import type {
  BuildRule,
  ColorCell,
  CubeColorKey,
  CubeData,
  Scene,
  ViewFace,
} from '../types/game';
import { CUBE_COLOR_HEX, CUBE_COLOR_LABEL } from './constants';
import { normalizeProjectionTo3x3 } from './projectionGrid';

export function countColor(cubes: CubeData[], color: CubeColorKey): number {
  const target = CUBE_COLOR_HEX[color].toLowerCase();
  return cubes.filter(c => c.color.toLowerCase() === target).length;
}

/**
 * 한 면(|dx|+|dy|+|dz|=1)으로 맞닿는 (colorA, colorB) 쌍의 개수.
 * 모서리/꼭짓점 접촉은 제외. 같은 색끼리(colorA===colorB)도 정상 카운트.
 */
export function countFaceContacts(
  cubes: CubeData[],
  colorA: CubeColorKey,
  colorB: CubeColorKey,
): number {
  const aHex = CUBE_COLOR_HEX[colorA].toLowerCase();
  const bHex = CUBE_COLOR_HEX[colorB].toLowerCase();
  let count = 0;
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      const c1 = cubes[i];
      const c2 = cubes[j];
      const manhattan = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y) + Math.abs(c1.z - c2.z);
      if (manhattan !== 1) continue;
      const a = c1.color.toLowerCase();
      const b = c2.color.toLowerCase();
      if ((a === aHex && b === bHex) || (a === bHex && b === aHex)) count++;
    }
  }
  return count;
}

/**
 * 방향에서 보이는 큐브들 (depth가 가장 가까운 것만).
 * front: smallest z per (x,y)
 * back:  largest z per (x,y)
 * top:   largest y per (x,z)
 * left:  smallest x per (z,y)
 * right: largest x per (z,y)
 */
export function visibleCubesFrom(cubes: CubeData[], face: ViewFace): CubeData[] {
  const map = new Map<string, CubeData>();
  for (const c of cubes) {
    let key: string;
    let better: (cur: CubeData, next: CubeData) => boolean;
    switch (face) {
      case 'front':
        key = `${c.x},${c.y}`;
        better = (cur, next) => next.z < cur.z;
        break;
      case 'back':
        key = `${c.x},${c.y}`;
        better = (cur, next) => next.z > cur.z;
        break;
      case 'top':
        key = `${c.x},${c.z}`;
        better = (cur, next) => next.y > cur.y;
        break;
      case 'left':
        key = `${c.z},${c.y}`;
        better = (cur, next) => next.x < cur.x;
        break;
      case 'right':
        key = `${c.z},${c.y}`;
        better = (cur, next) => next.x > cur.x;
        break;
    }
    const cur = map.get(key);
    if (!cur || better(cur, c)) map.set(key, c);
  }
  return [...map.values()];
}

export function calculateVisibleBlockCount(cubes: CubeData[], face: ViewFace): number {
  return visibleCubesFrom(cubes, face).length;
}

export function calculateVisibleColorCount(
  cubes: CubeData[],
  face: ViewFace,
  color: CubeColorKey,
): number {
  const target = CUBE_COLOR_HEX[color].toLowerCase();
  return visibleCubesFrom(cubes, face).filter(c => c.color.toLowerCase() === target).length;
}

/**
 * 3x3 색깔 격자.
 * 어느 방향이든 같은 시선줄에서는 보는 쪽에 가장 가까운 큐브 하나만 보인다.
 * front/back/left/right는 y=0이 화면 맨 아래, top은 z=0이 화면 맨 앞줄이다.
 */
export function calculateColorProjection(cubes: CubeData[], face: ViewFace): ColorCell[][] {
  if (!cubes.length) return normalizeProjectionTo3x3([[null]], face);
  const visible = visibleCubesFrom(cubes, face);

  const axes = (() => {
    switch (face) {
      // grid[row=maxRow-y][col=x]
      case 'front': return { row: (c: CubeData) => c.y, col: (c: CubeData) => c.x, flipRow: true };
      // back: front와 같은 좌표 격자, 보이는 큐브만 z 최대 기준.
      case 'back':  return { row: (c: CubeData) => c.y, col: (c: CubeData) => c.x, flipRow: true };
      // top: rows = z(front->back), cols = x(left->right)
      case 'top':   return { row: (c: CubeData) => c.z, col: (c: CubeData) => c.x, flipRow: false };
      // left: rows = y(bottom->top), cols = z(front->back)
      case 'left':  return { row: (c: CubeData) => c.y, col: (c: CubeData) => c.z, flipRow: true };
      // right: left와 같은 좌표 격자, 보이는 큐브만 x 최대 기준.
      case 'right': return { row: (c: CubeData) => c.y, col: (c: CubeData) => c.z, flipRow: true };
    }
  })();

  const rowVals = visible.map(axes.row);
  const colVals = visible.map(axes.col);
  const maxRow = Math.max(...rowVals, 0);
  const maxCol = Math.max(...colVals, 0);
  const rows = maxRow + 1;
  const cols = maxCol + 1;

  const grid: ColorCell[][] = Array.from({ length: rows }, () =>
    Array<ColorCell>(cols).fill(null),
  );
  for (const c of visible) {
    const rRaw = axes.row(c);
    const cRaw = axes.col(c);
    const r = axes.flipRow ? maxRow - rRaw : rRaw;
    const col = cRaw;
    if (r >= 0 && r < rows && col >= 0 && col < cols) grid[r][col] = c.color;
  }
  return normalizeProjectionTo3x3(grid, face);
}

export function calculateShapeProjection(cubes: CubeData[], face: ViewFace): number[][] {
  return calculateColorProjection(cubes, face).map(row => row.map(cell => (cell ? 1 : 0)));
}

// ---------- Rule validation ----------

export interface RuleResult {
  rule: BuildRule;
  ok: boolean;
  current: number | string;
  target: number | string;
  label: string; // 사용자에게 보여줄 한 줄
}

const FACE_LABEL: Record<ViewFace, string> = {
  front: '앞에서',
  back: '뒤에서',
  top: '위에서',
  left: '왼쪽에서',
  right: '오른쪽에서',
};

export function evaluateRule(cubes: CubeData[], rule: BuildRule): RuleResult {
  switch (rule.type) {
    case 'exactCubeCount': {
      const cur = cubes.length;
      return {
        rule,
        ok: cur === rule.count,
        current: cur,
        target: rule.count,
        label: `큐브 ${rule.count}개 사용`,
      };
    }
    case 'requiredColorCount': {
      const cur = countColor(cubes, rule.color);
      return {
        rule,
        ok: cur === rule.count,
        current: cur,
        target: rule.count,
        label: `${CUBE_COLOR_LABEL[rule.color]} ${rule.count}개 사용`,
      };
    }
    case 'colorTouchCount': {
      const cur = countFaceContacts(cubes, rule.colorA, rule.colorB);
      return {
        rule,
        ok: cur === rule.count,
        current: cur,
        target: rule.count,
        label: `${CUBE_COLOR_LABEL[rule.colorA]}-${CUBE_COLOR_LABEL[rule.colorB]} 만남: ${rule.count}번`,
      };
    }
    case 'visibleColorCount': {
      const cur = calculateVisibleColorCount(cubes, rule.face, rule.color);
      return {
        rule,
        ok: cur === rule.count,
        current: cur,
        target: rule.count,
        label: `${FACE_LABEL[rule.face]} 본 ${CUBE_COLOR_LABEL[rule.color]} ${rule.count}개`,
      };
    }
    case 'colorMustBeHiddenFrom': {
      const cur = calculateVisibleColorCount(cubes, rule.face, rule.color);
      return {
        rule,
        ok: cur === 0,
        current: cur,
        target: 0,
        label: `${FACE_LABEL[rule.face]} ${CUBE_COLOR_LABEL[rule.color]} 안 보이게`,
      };
    }
    case 'visibleBlockCountCompare': {
      const a = calculateVisibleBlockCount(cubes, rule.faceA);
      const b = calculateVisibleBlockCount(cubes, rule.faceB);
      const ok = rule.relation === 'same' ? a === b : a !== b;
      return {
        rule,
        ok,
        current: `${a} vs ${b}`,
        target: rule.relation === 'same' ? '같음' : '다름',
        label: `${FACE_LABEL[rule.faceA]}/${FACE_LABEL[rule.faceB]} 블록 수 ${rule.relation === 'same' ? '같게' : '다르게'}`,
      };
    }
    case 'targetShapeProjection': {
      const actual = calculateShapeProjection(cubes, rule.face);
      const ok = compareGrid(actual, rule.grid, rule.face);
      return {
        rule,
        ok,
        current: ok ? '맞음' : '다름',
        target: '일치',
        label: `${FACE_LABEL[rule.face]} 본 자리 맞추기`,
      };
    }
    case 'targetColorProjection': {
      const actual = calculateColorProjection(cubes, rule.face);
      const ok = compareColorGrid(actual, rule.grid, rule.face);
      return {
        rule,
        ok,
        current: ok ? '맞음' : '다름',
        target: '일치',
        label: `${FACE_LABEL[rule.face]} 본 모습 맞추기`,
      };
    }
  }
}

function compareGrid(a: number[][], b: number[][], face: ViewFace): boolean {
  const na = normalizeProjectionTo3x3(a, face);
  const nb = normalizeProjectionTo3x3(b, face);
  if (na.length !== nb.length) return false;
  if ((na[0]?.length ?? 0) !== (nb[0]?.length ?? 0)) return false;
  return na.every((row, r) => row.every((c, i) => c === nb[r][i]));
}

function compareColorGrid(a: ColorCell[][], b: ColorCell[][], face: ViewFace): boolean {
  // 좌표 기준이 고정되어 있으므로 3×3 안의 빈칸 위치까지 정확히 비교한다.
  const na = normalizeProjectionTo3x3(a, face);
  const nb = normalizeProjectionTo3x3(b, face);
  if (na.length !== nb.length) return false;
  if ((na[0]?.length ?? 0) !== (nb[0]?.length ?? 0)) return false;
  return na.every((row, r) =>
    row.every((cell, i) => {
      const x = cell?.toLowerCase() ?? null;
      const y = nb[r][i]?.toLowerCase() ?? null;
      return x === y;
    }),
  );
}

export interface BuildValidationResult {
  success: boolean;
  results: RuleResult[];
  message: string;
}

export interface BuildValidationOptions {
  strict?: boolean;
}

export function isRuleRequiredForSuccess(rule: BuildRule): boolean {
  return !rule.displayOnly && rule.requiredForSuccess !== false;
}

function missionFailureMessage(mission: Scene, first: RuleResult): string {
  if (mission.id === 2) {
    return '앞에서 본 모습이 아직 그림과 달라요.\n빨강과 파랑이 아래 줄에 보이게 만들어봐요.';
  }
  if (mission.id === 3) {
    return '앞에서 본 그림이나 위에서 본 자리가 아직 달라요.\n힌트 그림을 다시 볼까요?';
  }

  switch (first.rule.type) {
    case 'targetShapeProjection':
      return `${FACE_LABEL[first.rule.face]} 본 자리가 아직 달라요. 그림 모양을 다시 만들어봐요.`;
    case 'targetColorProjection':
      return `거의 다 왔어요! ${FACE_LABEL[first.rule.face]} 본 모습을 그림과 똑같이 만들어봐요.`;
    default:
      return '아직 목표 그림과 조금 달라요. 힌트 그림을 다시 볼까요?';
  }
}

function strictFailureMessage(first: RuleResult): string {
  // 가장 먼저 실패한 규칙을 부드럽게 안내.
  let detail = '';
  switch (first.rule.type) {
    case 'exactCubeCount': {
      const diff = (first.current as number) - (first.target as number);
      detail = diff > 0
        ? `큐브 수가 조금 달라요. ${diff}개만 살짝 빼볼까요?`
        : `큐브 수가 조금 달라요. ${Math.abs(diff)}개만 더 놓아볼까요?`;
      break;
    }
    case 'requiredColorCount': {
      const label = CUBE_COLOR_LABEL[first.rule.color];
      const diff = (first.current as number) - (first.target as number);
      detail = diff > 0
        ? `${label} 큐브가 조금 많아요. ${diff}개만 빼볼까요?`
        : `${label} 큐브가 조금 부족해요. ${Math.abs(diff)}개만 더 놓아볼까요?`;
      break;
    }
    case 'colorTouchCount':
      detail = '두 색깔이 만나는 횟수가 조금 달라요. 옆으로 살짝 옮겨볼까요?';
      break;
    case 'visibleColorCount':
      detail = `${FACE_LABEL[first.rule.face]} 본 ${CUBE_COLOR_LABEL[first.rule.color]} 큐브 수가 아직 달라요. 그림과 다시 비교해봐요.`;
      break;
    case 'colorMustBeHiddenFrom':
      detail = `${CUBE_COLOR_LABEL[first.rule.color]} 큐브가 ${FACE_LABEL[first.rule.face]} 보여요. 다른 큐브 뒤에 살짝 숨겨볼까요?`;
      break;
    case 'visibleBlockCountCompare':
      detail = '앞에서와 뒤에서 보이는 칸 수를 한 번 더 맞춰볼까요?';
      break;
    case 'targetShapeProjection':
      detail = `${FACE_LABEL[first.rule.face]} 본 자리가 아직 달라요. 그림 모양을 다시 만들어봐요.`;
      break;
    case 'targetColorProjection':
      detail = `거의 다 왔어요! ${FACE_LABEL[first.rule.face]} 본 모습을 그림과 똑같이 만들어봐요.`;
      break;
  }
  return detail;
}

export function validateBuildMission(
  cubes: CubeData[],
  mission: Scene,
  options: BuildValidationOptions = {},
): BuildValidationResult {
  const rules = mission.rules ?? [];
  const results = rules.map(r => evaluateRule(cubes, r));
  const blockingResults = options.strict
    ? results
    : results.filter(result => isRuleRequiredForSuccess(result.rule));

  const failed = blockingResults.filter(r => !r.ok);
  if (failed.length === 0) {
    return {
      success: true,
      results,
      message: mission.successText ?? '비밀 건물이 완성되었어요!',
    };
  }

  const first = failed[0];
  const detail = options.strict ? strictFailureMessage(first) : missionFailureMessage(mission, first);

  return { success: false, results, message: detail };
}
