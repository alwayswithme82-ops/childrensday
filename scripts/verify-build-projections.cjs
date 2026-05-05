const assert = require('node:assert/strict');
const { createJiti } = require('jiti');

const jiti = createJiti(process.cwd() + '/');
const {
  calculateColorProjection,
  calculateShapeProjection,
  calculateVisibleColorCount,
  compareColorGrid,
  compareGrid,
  evaluateRule,
  normalizeColorValue,
  validateBuildMission,
  visibleCubesFrom,
} = jiti('../src/utils/buildValidation.ts');
const { CUBE_COLOR_HEX } = jiti('../src/utils/constants.ts');
const { buildLevels } = jiti('../src/data/buildLevels.ts');
const { normalizeProjectionTo3x3 } = jiti('../src/utils/projectionGrid.ts');

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const Y = CUBE_COLOR_HEX.yellow;
const _ = null;

function sameGrid(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
}

function visibleColors(cubes, face) {
  return visibleCubesFrom(cubes, face).map(c => normalizeColorValue(c.color)).sort();
}

const hiddenCases = [
  {
    name: 'front hidden',
    face: 'front',
    cubes: [
      { x: 1, y: 0, z: 0, color: B },
      { x: 1, y: 0, z: 1, color: Y },
    ],
  },
  {
    name: 'back hidden',
    face: 'back',
    cubes: [
      { x: 1, y: 0, z: 1, color: B },
      { x: 1, y: 0, z: 0, color: Y },
    ],
  },
  {
    name: 'left hidden',
    face: 'left',
    cubes: [
      { x: 0, y: 0, z: 1, color: B },
      { x: 1, y: 0, z: 1, color: Y },
    ],
  },
  {
    name: 'right hidden',
    face: 'right',
    cubes: [
      { x: 1, y: 0, z: 1, color: B },
      { x: 0, y: 0, z: 1, color: Y },
    ],
  },
  {
    name: 'top hidden',
    face: 'top',
    cubes: [
      { x: 1, y: 1, z: 1, color: B },
      { x: 1, y: 0, z: 1, color: Y },
    ],
  },
];

for (const test of hiddenCases) {
  assert.deepEqual(visibleColors(test.cubes, test.face), [B], `${test.name}: visibleCubesFrom`);
  assert.equal(calculateVisibleColorCount(test.cubes, test.face, 'blue'), 1, `${test.name}: blue count`);
  assert.equal(calculateVisibleColorCount(test.cubes, test.face, 'yellow'), 0, `${test.name}: yellow hidden`);
  assert.equal(
    evaluateRule(test.cubes, { type: 'colorMustBeHiddenFrom', color: 'yellow', face: test.face }).ok,
    true,
    `${test.name}: colorMustBeHiddenFrom`,
  );
  const expectedShape = test.face === 'top'
    ? [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]
    : test.face === 'right'
      ? [
        [0, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
      ]
    : [
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 0],
    ];
  sameGrid(
    calculateShapeProjection(test.cubes, test.face),
    expectedShape,
    `${test.name}: shape projection`,
  );
}

const mission2Official = [
  { x: 0, y: 0, z: 0, color: R },
  { x: 1, y: 0, z: 0, color: B },
  { x: 1, y: 0, z: 1, color: Y },
];

const mission1HexCubes = [
  { x: 0, y: 0, z: 0, color: R },
  { x: 1, y: 0, z: 0, color: B },
  { x: 1, y: 1, z: 0, color: B },
];
const mission1FromData = buildLevels[0].scenes[0];
const mission1KeyTarget = {
  id: 1,
  characterName: 'projection-test',
  storyText: '',
  cubes: [],
  questionType: 'building',
  questionText: '',
  options: [],
  hintText: '',
  rules: [
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, _, _],
        [_, 'blue', _],
        ['red', 'blue', _],
      ],
      requiredForSuccess: true,
    },
  ],
};
const expectedMission1Front = [
  [_, _, _],
  [_, B, _],
  [R, B, _],
];
sameGrid(
  normalizeProjectionTo3x3(calculateColorProjection(mission1HexCubes, 'front'), 'front'),
  expectedMission1Front,
  'Mission 1 front projection matches the 3x3 door target',
);
sameGrid(
  normalizeProjectionTo3x3(calculateColorProjection(mission1FromData.officialSolution, 'front'), 'front'),
  expectedMission1Front,
  'Mission 1 officialSolution front projection matches buildLevels target',
);
assert.equal(
  validateBuildMission(mission1FromData.officialSolution, mission1FromData).success,
  true,
  'Mission 1 officialSolution validates against buildLevels Mission 1',
);
assert.equal(
  validateBuildMission(mission1HexCubes, mission1KeyTarget, { strict: true }).success,
  true,
  'Mission 1 accepts color keys in target grid against HEX cube colors',
);
assert.equal(
  compareColorGrid(
    calculateColorProjection(mission1HexCubes, 'front'),
    [
      [_, _, _],
      [_, 'blue', _],
      ['red', 'blue', _],
    ],
    'front',
  ),
  true,
  'compareColorGrid normalizes color keys in target grid',
);

assert.equal(
  compareColorGrid(
    calculateColorProjection(mission1HexCubes, 'front'),
    expectedMission1Front,
    'front',
  ),
  true,
  'compareColorGrid strictly accepts Mission 1 HEX target grid',
);
assert.equal(
  compareGrid(
    calculateShapeProjection(mission1HexCubes, 'front'),
    [
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    'front',
  ),
  true,
  'compareGrid strictly accepts Mission 1 shape target grid',
);

const mission2Rules = {
  id: 2,
  characterName: 'projection-test',
  storyText: '',
  cubes: [],
  questionType: 'building',
  questionText: '',
  options: [],
  hintText: '',
  rules: [
    {
      type: 'targetColorProjection',
      face: 'front',
      grid: [
        [_, _, _],
        [_, _, _],
        [R, B, _],
      ],
      requiredForSuccess: true,
    },
    { type: 'exactCubeCount', count: 3, displayOnly: true },
    { type: 'requiredColorCount', color: 'red', count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'blue', count: 1, displayOnly: true },
    { type: 'requiredColorCount', color: 'yellow', count: 1, displayOnly: true },
    { type: 'colorMustBeHiddenFrom', color: 'yellow', face: 'front', displayOnly: true },
  ],
};

sameGrid(
  calculateColorProjection(mission2Official, 'front'),
  [
    [_, _, _],
    [_, _, _],
    [R, B, _],
  ],
  'Mission 2 front hides yellow behind blue',
);
sameGrid(
  calculateColorProjection(mission2Official, 'top'),
  [
    [R, B, _],
    [_, Y, _],
    [_, _, _],
  ],
  'Mission 2 top shows yellow behind blue',
);
assert.equal(validateBuildMission(mission2Official, mission2Rules, { strict: true }).success, true, 'Mission 2 official validates');

const visibleYellowAboveBlue = [
  { x: 0, y: 0, z: 0, color: R },
  { x: 1, y: 0, z: 0, color: B },
  { x: 1, y: 1, z: 1, color: Y },
];
sameGrid(
  calculateColorProjection(visibleYellowAboveBlue, 'front'),
  [
    [_, _, _],
    [_, Y, _],
    [R, B, _],
  ],
  'Yellow at different y is visible from front',
);

console.log('[OK] build projection visibility rules');
