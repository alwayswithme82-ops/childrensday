/**
 * 정답 판정 종합 테스트 — 9개 미션 전부
 * npx tsx scripts/test-validation.ts
 */
import { buildLevels } from '../src/data/buildLevels';
import { validateBuildMission, calculateColorProjection, calculateShapeProjection } from '../src/utils/buildValidation';
import { CUBE_COLOR_HEX } from '../src/utils/constants';
import type { CubeData, Scene } from '../src/types/game';

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const G = CUBE_COLOR_HEX.green;
const Y = CUBE_COLOR_HEX.yellow;

const allMissions: Scene[] = [];
const seen = new Set<number>();
for (const level of buildLevels) {
  for (const s of level.scenes) {
    if (!seen.has(s.id)) { seen.add(s.id); allMissions.push(s); }
  }
}
const m = Object.fromEntries(allMissions.map(s => [s.id, s]));

let pass = 0, fail = 0;

function proj(cubes: CubeData[]) {
  return {
    front: calculateColorProjection(cubes, 'front').map(r => r.map(c => c ? c.slice(1,4) : '---').join(' ')).join(' | '),
    top:   calculateShapeProjection(cubes, 'top').map(r => r.join('')).join('|'),
    left:  calculateColorProjection(cubes, 'left').map(r => r.map(c => c ? c.slice(1,4) : '---').join(' ')).join(' | '),
    right: calculateColorProjection(cubes, 'right').map(r => r.map(c => c ? c.slice(1,4) : '---').join(' ')).join(' | '),
    back:  calculateColorProjection(cubes, 'back').map(r => r.map(c => c ? c.slice(1,4) : '---').join(' ')).join(' | '),
  };
}

function check(label: string, cubes: CubeData[], mission: Scene, expectSuccess: boolean) {
  const result = validateBuildMission(cubes, mission);
  const ok = result.success === expectSuccess;
  if (ok) {
    console.log(`  ✅ ${label}`);
    pass++;
  } else {
    const p = proj(cubes);
    console.error(`  ❌ ${label}`);
    console.error(`     기대: ${expectSuccess ? '성공' : '실패'} / 실제: ${result.success ? '성공' : '실패'}`);
    console.error(`     메시지: ${result.message}`);
    console.error(`     front: ${p.front}`);
    console.error(`     top:   ${p.top}`);
    console.error(`     left:  ${p.left}`);
    console.error(`     right: ${p.right}`);
    console.error(`     back:  ${p.back}`);
    fail++;
  }
}

// ═══════════════════════════════════════════════════
// M1 — 무지개 문 (front 색깔)
// 필수: front = [[null,B],[R,B]] (trimmed)
// ═══════════════════════════════════════════════════
console.log('\n■ M1 무지개 문');
check('공식 정답', m[1].officialSolution!, m[1], true);

check('x=1,2 오른쪽 이동', [
  { x:1, y:0, z:0, color:R },
  { x:2, y:0, z:0, color:B },
  { x:2, y:1, z:0, color:B },
], m[1], true);

check('z=2 깊이 이동', [
  { x:0, y:0, z:2, color:R },
  { x:1, y:0, z:2, color:B },
  { x:1, y:1, z:2, color:B },
], m[1], true);

check('뒤에 초록 숨김 (front에 안 보임)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
  { x:0, y:0, z:1, color:G },
], m[1], true);

check('FAIL: 파랑 가로 배치 (세로 아님)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:B },
], m[1], false);

check('FAIL: R↔B 색 반대', [
  { x:0, y:0, z:0, color:B },
  { x:1, y:0, z:0, color:R },
  { x:1, y:1, z:0, color:B },
], m[1], false);

check('FAIL: 초록이 보임', [
  { x:0, y:0, z:0, color:G },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
], m[1], false);

check('FAIL: 빨강이 2층에', [
  { x:0, y:1, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
], m[1], false);

// ═══════════════════════════════════════════════════
// M2 — 숨바꼭질 노랑 큐브 (front 색깔만 필수)
// 필수: front = [[R,B]] (trimmed)
// ═══════════════════════════════════════════════════
console.log('\n■ M2 숨바꼭질 노랑 큐브');
check('공식 정답', m[2].officialSolution!, m[2], true);

check('노랑 z=2 더 뒤에', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:2, color:Y },
], m[2], true);

check('x=1,2 이동 + 노랑 뒤', [
  { x:1, y:0, z:0, color:R },
  { x:2, y:0, z:0, color:B },
  { x:2, y:0, z:1, color:Y },
], m[2], true);

check('추가 큐브 앞에서 안 보이는 위치', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y },
  { x:0, y:0, z:2, color:G }, // 빨강 뒤 뒤: front에서 R이 가림
], m[2], true);

check('FAIL: 노랑이 파랑 앞에 (front에 노랑 보임)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:Y }, // Y가 앞
  { x:1, y:0, z:1, color:B }, // B가 뒤
], m[2], false);

check('FAIL: front에 R만 (파랑 없음)', [
  { x:0, y:0, z:0, color:R },
  { x:0, y:0, z:1, color:B },
  { x:0, y:0, z:2, color:Y },
], m[2], false);

check('FAIL: front에 G 보임', [
  { x:0, y:0, z:0, color:G },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y },
], m[2], false);

// ═══════════════════════════════════════════════════
// M3 — 반짝 보물탑 (front 색깔 + top 모양)
// front trimmed: [[null,G],[R,B]]
// top trimmed: [[1,1],[1,0]]
// ═══════════════════════════════════════════════════
console.log('\n■ M3 반짝 보물탑');
check('공식 정답', m[3].officialSolution!, m[3], true);

check('x+1,z+1 이동', [
  { x:1, y:0, z:1, color:R },
  { x:2, y:0, z:1, color:B },
  { x:2, y:1, z:1, color:G },
  { x:1, y:0, z:2, color:B },
], m[3], true);

check('FAIL: 뒤 파랑 z=2 (top 내부 빈 줄)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:2, color:B },
], m[3], false);

check('FAIL: 초록→파랑 (front 색 다름)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:B },
  { x:0, y:0, z:1, color:B },
], m[3], false);

check('FAIL: top 모양 다름 (일직선)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:2, y:0, z:0, color:B }, // z=0 → top이 앞줄 3칸 일직선
], m[3], false);

check('FAIL: front 빨강 위치 다름', [
  { x:1, y:0, z:0, color:R }, // R을 오른쪽으로
  { x:0, y:0, z:0, color:B },
  { x:0, y:1, z:0, color:G },
  { x:1, y:0, z:1, color:B },
], m[3], false);

// ═══════════════════════════════════════════════════
// M4 — 쌍둥이 기둥 (front 색깔 + top 모양)
// front trimmed: [[R,G],[R,B]]
// top trimmed: [[1,1]]
// ═══════════════════════════════════════════════════
console.log('\n■ M4 쌍둥이 기둥');
check('공식 정답', m[4].officialSolution!, m[4], true);

check('x=1,2 이동', [
  { x:1, y:0, z:0, color:R },
  { x:1, y:1, z:0, color:R },
  { x:2, y:0, z:0, color:B },
  { x:2, y:1, z:0, color:G },
], m[4], true);

check('FAIL: 초록↔파랑 바뀜', [
  { x:0, y:0, z:0, color:R },
  { x:0, y:1, z:0, color:R },
  { x:1, y:0, z:0, color:G }, // B→G
  { x:1, y:1, z:0, color:B }, // G→B
], m[4], false);

check('FAIL: top에 뒷줄 추가 (top 모양 다름)', [
  { x:0, y:0, z:0, color:R },
  { x:0, y:1, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:R }, // 뒷줄 추가 → top 모양 바뀜
], m[4], false);

check('FAIL: 빨강 1층만 (2층 아님)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
], m[4], false);

// ═══════════════════════════════════════════════════
// M5 — 뒤에 숨은 파랑 (front 색깔만 필수)
// front trimmed: [[R,B,B]]
// ═══════════════════════════════════════════════════
console.log('\n■ M5 뒤에 숨은 파랑');
check('공식 정답', m[5].officialSolution!, m[5], true);

check('오른쪽 파랑 앞에도 됨 (R,B,B 나란히)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y },
  { x:2, y:0, z:0, color:B }, // B가 z=0 → 앞에서 보임: R,B,B ✓
], m[5], true);

check('x=0,1,2 전부 앞줄', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:Y }, // 노랑은 뒤에
], m[5], true);

check('FAIL: 노랑이 앞에 보임', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:Y }, // Y 앞
  { x:1, y:0, z:1, color:B },
  { x:2, y:0, z:1, color:B },
], m[5], false);

check('FAIL: front에 R,B만 (파랑 하나 부족)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:1, color:Y }, // 세 번째 칸에 Y가 뒤에만
], m[5], false);

check('FAIL: front에 R 없음', [
  { x:0, y:0, z:0, color:B },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:B },
  { x:0, y:0, z:1, color:Y },
], m[5], false);

// ═══════════════════════════════════════════════════
// M6 — ㄴ자 계단 (front 색깔 + top 모양)
// front trimmed: [[Y,null,null],[R,B,B]]
// top trimmed: [[1,1,0],[1,0,1]]
// ═══════════════════════════════════════════════════
console.log('\n■ M6 ㄴ자 계단');
check('공식 정답', m[6].officialSolution!, m[6], true);

// z+1 이동: 모든 z를 +1
check('z+1 이동', [
  { x:0, y:0, z:1, color:R },
  { x:0, y:1, z:1, color:Y },
  { x:1, y:0, z:1, color:B },
  { x:0, y:0, z:2, color:G },
  { x:2, y:0, z:2, color:B },
], m[6], true);

check('FAIL: top 오른쪽 파랑 x=2→x=1 (모양 다름)', [
  { x:0, y:0, z:0, color:R },
  { x:0, y:1, z:0, color:Y },
  { x:1, y:0, z:0, color:B },
  { x:0, y:0, z:1, color:G },
  { x:1, y:0, z:1, color:B }, // x=2→x=1 : top [[1,1],[1,1]] ≠ [[1,1,0],[1,0,1]]
], m[6], false);

check('FAIL: 노랑 없음 (front 모양 다름)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:0, y:0, z:1, color:G },
  { x:2, y:0, z:1, color:B },
], m[6], false);

check('FAIL: front 빨강 2층 아님', [
  { x:0, y:0, z:0, color:Y },
  { x:0, y:1, z:0, color:R }, // Y↔R 바뀜
  { x:1, y:0, z:0, color:B },
  { x:0, y:0, z:1, color:G },
  { x:2, y:0, z:1, color:B },
], m[6], false);

// ═══════════════════════════════════════════════════
// M7 — 세 방향 탑 (front shape + top shape)
// front shape trimmed: [[0,1,0],[1,1,1]]
// top trimmed: [[1,1,0],[1,0,1]]
// ═══════════════════════════════════════════════════
console.log('\n■ M7 세 방향 탑 (front shape + top)');
check('공식 정답', m[7].officialSolution!, m[7], true);

check('색 위치가 달라도 개수+앞 모양+위 자리 맞으면 성공', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:G },
  { x:1, y:1, z:0, color:B },
  { x:0, y:0, z:1, color:B },
  { x:2, y:0, z:1, color:Y },
], m[7], true);

check('FAIL: 색 개수 다름', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:G },
  { x:1, y:1, z:0, color:Y },
  { x:0, y:0, z:1, color:B },
  { x:2, y:0, z:1, color:G },
], m[7], false);

check('FAIL: top 모양 다름 (오른쪽 뒤 없음)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:Y },
  // x=2,z=1 없음 → top 모양 다름
], m[7], false);

check('FAIL: front 2층 없음', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:0, y:0, z:1, color:Y },
  { x:2, y:0, z:1, color:B },
], m[7], false);

check('FAIL: front 바닥 세 칸 아님', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:0, y:0, z:1, color:Y },
  // x=2,z=1 없음 → top도/front도 부족
], m[7], false);

// ═══════════════════════════════════════════════════
// M8 — 숨은 보석탑 (front shape + top shape)
// front shape trimmed: [[0,1,1],[1,1,1]]
// top trimmed: [[1,1,0],[0,1,1]]
// ═══════════════════════════════════════════════════
console.log('\n■ M8 숨은 보석탑 (front shape + top)');
check('공식 정답', m[8].officialSolution!, m[8], true);

check('색 위치가 달라도 개수+앞 모양+위 자리 맞으면 성공', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G }, // Y→G
  { x:1, y:0, z:1, color:Y }, // G→Y
  { x:2, y:0, z:1, color:B },
  { x:2, y:1, z:1, color:G },
], m[8], true);

check('FAIL: 색 개수 다름', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:G },
  { x:1, y:0, z:1, color:G },
  { x:2, y:0, z:1, color:B },
  { x:2, y:1, z:1, color:G },
], m[8], false);

check('FAIL: top 모양 다름 (앞줄 3칸)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:1, z:0, color:Y },
  { x:2, y:0, z:0, color:B }, // z=1→z=0: top 모양이 앞줄 3칸
  { x:2, y:1, z:0, color:G },
  { x:1, y:0, z:1, color:G },
], m[8], false);

check('FAIL: front 2층 한 칸 부족', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:1, y:0, z:1, color:G },
  { x:2, y:0, z:1, color:B },
  { x:2, y:1, z:1, color:G },
], m[8], false);

// ═══════════════════════════════════════════════════
// M9 — 큐브왕의 왕관 (front + top + back)
// front trimmed: [[Y,G,Y],[R,B,G]]
// top trimmed: [[1,1,1],[0,1,0]]
// back trimmed: [[Y,G,Y],[R,B,G]] (앞과 동일)
// ═══════════════════════════════════════════════════
console.log('\n■ M9 큐브왕의 왕관 (front+top+back)');
check('공식 정답', m[9].officialSolution!, m[9], true);

check('FAIL: back 면 다름 (가운데 뒤 초록 없음)', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:G },
  { x:0, y:1, z:0, color:Y },
  { x:2, y:1, z:0, color:Y },
  // B(1,0,1), G(1,1,1) 없음 → back의 가운데가 B(z=0)만 → front=back 불일치
], m[9], false);

check('FAIL: top 가운데 뒤 없음', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:G },
  { x:0, y:1, z:0, color:Y },
  { x:2, y:1, z:0, color:Y },
  { x:1, y:0, z:1, color:B }, // G(1,1,1) 없음 → back 가운데 2층 없음
], m[9], false);

check('FAIL: front 색 다름', [
  { x:0, y:0, z:0, color:R },
  { x:1, y:0, z:0, color:B },
  { x:2, y:0, z:0, color:Y }, // G→Y
  { x:0, y:1, z:0, color:Y },
  { x:2, y:1, z:0, color:G }, // Y→G
  { x:1, y:0, z:1, color:B },
  { x:1, y:1, z:1, color:G },
], m[9], false);

// ═══════════════════════════════════════════════════
// 결과
// ═══════════════════════════════════════════════════
console.log(`\n${'─'.repeat(55)}`);
console.log(`결과: 총 ${pass + fail}개 중 ${pass}개 통과 / ${fail}개 실패`);
if (fail > 0) {
  console.error(`\n⚠️  ${fail}개 케이스 수정 필요`);
  process.exit(1);
} else {
  console.log('\n🎉 모든 테스트 통과!');
  process.exit(0);
}
