// One-off script: run validateBuildMission against each mission's officialSolution.
// Run with: npx tsx scripts/verify-official-solutions.ts
import { buildLevels } from '../src/data/buildLevels';
import { validateBuildMission } from '../src/utils/buildValidation';

const seen = new Set<number>();
let failures = 0;
for (const level of buildLevels) {
  for (const mission of level.scenes) {
    if (seen.has(mission.id)) continue;
    seen.add(mission.id);
    if (!mission.officialSolution) {
      console.error(`[FAIL] Mission ${mission.id} "${mission.title}" has no officialSolution.`);
      failures++;
      continue;
    }
    const result = validateBuildMission(mission.officialSolution, mission);
    if (!result.success) {
      const failed = result.results.filter(r => !r.ok);
      console.error(
        `[FAIL] Mission ${mission.id} "${mission.title}":`,
        failed.map(r => `${r.label} (현재 ${r.current} / 목표 ${r.target})`).join('; '),
      );
      failures++;
    } else {
      console.log(`[OK]   Mission ${mission.id} "${mission.title}" — all rules pass.`);
    }
  }
}
process.exit(failures === 0 ? 0 : 1);
