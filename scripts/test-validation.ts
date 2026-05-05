/**
 * 정답 판정 종합 테스트
 * npx tsx scripts/test-validation.ts
 */
import { buildLevels } from '../src/data/buildLevels';
import { validateBuildMission, calculateColorProjection } from '../src/utils/buildValidation';
import { CUBE_COLOR_HEX } from '../src/utils/constants';
import type { CubeData, Scene } from '../src/types/game';

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const G = CUBE_COLOR_HEX.green;
const Y = CUBE_COLOR_HEX.yellow;

const allMissions: Scene[] = [];
const seen = new Set<number>();
for (const level of buildLevels) {
  for (const scene of level.scenes) {
    if (!seen.has(scene.id)) { seen.add(scene.id); allMissions.push(scene); }
  }
}
const m = Object.fromEntries(allMissions.map(s => [s.id, s]));

let pass = 0, fail = 0;

function check(label: string, cubes: CubeData[], mission: Scene, expectSuccess: boolean) {
  const result = validateBuildMission(cubes, mission);
  const ok = result.success === expectSuccess;
  if (ok) {
    console.log(`  ✅ ${label}`);
    pass++;
  } else {
    console.error(`  ❌ ${label}`);
    console.error(`     예상: ${expectSuccess ? '성공' : '실패'} / 실제: ${result.success ? '성공' : '실패'}`);
    console.error(`     메시지: ${result.message}`);
    console.error(`     front:`, calculateColorProjection(cubes, 'front').map(r => r.map(c => c ? c.slice(1,4) : '---').join(' ')).join(' | '));
    fail++;
  }
}

// ─────────────────────────────────────────────────
console.log('\n■ Mission 1 — 무지개 문');
// 공식 정답
check('공식 정답', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
], m[1], true);

// 한 칸 오른쪽으로 이동 (x=1,2) — 같은 모양
check('오른쪽 이동(x=1,2)', [
  { x:1, y:0, z:0, color:R },
  { x:2, y:0, z:0, color:B },
  { x:2, y:1, z:0, color:B },
], m[1], true);

// 뒤에 숨겨진 추가 큐브
check('뒤에 추가 큐브 숨김', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
  { x:0, y:0, z:1, color:G }, // 뒤에 숨겨진 초록
], m[1], true);

// z=2에 배치 (더 뒤)
check('z=2 배치', [
  { x:0, y:0, z:2, color:R },
  { x:1, y:0, z:2, color:B },
  { x:1, y:1, z:2, color:B },
], m[1], true);

// 실패: 빨강·파랑 위치 바뀜
check('색 위치 반대(R↔B)', [
  { x:0, y:0, z:0, color:B },
  { x:1, y:0, z:0, color:R },
  { x:1, y:1, z:0, color:B },
], m[1], false);

// 실패: 파랑 위아래 바뀜 (가로 배치)
check('파랑 가로 배치(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:B }, // 세로가 아닌 가로
], m[1], false);

// 실패: 앞에 보이는 색이 다름
check('초록 섞임(실패)', [
  { x:0, y:0, z:0, color:G },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
], m[1], false);

// ─────────────────────────────────────────────────
console.log('\n■ Mission 2 — 숨바꼭질 노랑 큐브');
// 공식 정답
check('공식 정답', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y },
], m[2], true);

// 노랑을 더 뒤에 숨겨도 됨
check('노랑을 z=2에 숨김', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:2, color:Y },
], m[2], true);

// 빨강·파랑 위치 이동
check('오른쪽 이동(x=1,2)', [
  { x:1, y:0, z:0, color:R },
  { x:2, y:0, z:0, color:B },
  { x:2, y:0, z:1, color:Y },
], m[2], true);

// 노랑이 앞에 보이면 실패 (front에 Y가 보임)
check('노랑이 파랑 앞에 있어 보임(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:1, color:B }, // B가 뒤
  { x:1, y:0, z:0, color:Y }, // Y가 앞 → front에 Y 보임
], m[2], false);

// 실패: 앞에 파랑 대신 초록
check('파랑 대신 초록(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:G },
  { x:1, y:0, z:1, color:Y },
], m[2], false);

// ─────────────────────────────────────────────────
console.log('\n■ Mission 3 — 반짝 보물탑');
// 공식 정답
check('공식 정답', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:B },
], m[3], true);

// 전체 이동 (x+1, z+1)
check('이동(x+1,z+1)', [
  { x:1, y:0, z:1, color:R },
  { x:2, y:0, z:1, color:B },
  { x:2, y:1, z:1, color:G },
  { x:1, y:0, z:2, color:B },
], m[3], true);

// 실패: 초록 없이 파랑만 (front 모양 다름)
check('초록 자리에 파랑(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B }, // 초록→파랑
  { x:0, y:0, z:1, color:B },
], m[3], false);

// 실패: top 모양 다름 (ㄴ자 아님)
check('top 모양 틀림(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:2, y:0, z:0, color:B }, // z=1이 아닌 z=0 → top이 일직선
], m[3], false);

// ─────────────────────────────────────────────────
console.log('\n■ Mission 4 — 쌍둥이 기둥');
check('공식 정답', [
  { x:0, y:0, z:0, color:R },
  { x:0, y:1, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
], m[4], true);

// 한 칸 이동
check('x=1,2 이동', [
  { x:1, y:0, z:0, color:R },
  { x:1, y:1, z:0, color:R },
  { x:2, y:0, z:0, color:B },
  { x:2, y:1, z:0, color:G },
], m[4], true);

// 실패: top 모양이 다름 (z=1 포함)
check('뒤에 추가(top 모양 다름)(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:0, y:1, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:R }, // top 모양 추가됨
], m[4], false);

// ─────────────────────────────────────────────────
console.log('\n■ Mission 5 — 뒤에 숨은 파랑');
check('공식 정답', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y },
  { x:2, y:0, z:1, color:B },
], m[5], true);

// 실패: 파랑 3개 나란히지만 오른쪽 B가 앞에 보임
check('오른쪽 B가 앞(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y },
  { x:2, y:0, z:0, color:B }, // z=0 → front에 B 보임 → 3개 [R,B,B] 맞음 ✓ 이건 성공이어야 함
], m[5], true); // R,B,B 나란히면 정답

// 실패: 오른쪽에 노랑 보임
check('오른쪽에 노랑 보임(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:Y },
], m[5], false);

// ─────────────────────────────────────────────────
console.log('\n■ Mission 7 — 세 방향 탑 (Hard)');
check('공식 정답', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:Y },
  { x:2, y:0, z:1, color:B },
], m[7], true);

// 실패: 노랑 대신 파랑 (left projection 다름)
check('노랑→파랑(실패)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:B }, // 노랑→파랑
  { x:2, y:0, z:1, color:B },
], m[7], false);

// ─────────────────────────────────────────────────
console.log('\n■ Mission 9 — 큐브왕의 왕관 (Hard)');
check('공식 정답 확인', (() => {
  // officialSolution
  const sol = m[9].officialSolution;
  if (!sol) { console.error('officialSolution 없음'); return []; }
  return sol;
})(), m[9], true);

// ─────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`결과: ${pass}개 통과 / ${fail}개 실패`);
if (fail > 0) {
  console.error(`\n⚠️  ${fail}개 케이스 수정 필요`);
  process.exit(1);
} else {
  console.log('\n🎉 모든 테스트 통과!');
  process.exit(0);
}
