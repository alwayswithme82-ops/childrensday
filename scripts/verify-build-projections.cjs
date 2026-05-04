const assert = require('node:assert/strict');
const { createJiti } = require('jiti');

const jiti = createJiti(process.cwd() + '/');
const {
  calculateColorProjection,
  calculateShapeProjection,
  calculateVisibleColorCount,
  evaluateRule,
  validateBuildMission,
  visibleCubesFrom,
} = jiti('../src/utils/buildValidation.ts');
const { CUBE_COLOR_HEX } = jiti('../src/utils/constants.ts');

const R = CUBE_COLOR_HEX.red;
const B = CUBE_COLOR_HEX.blue;
const Y = CUBE_COLOR_HEX.yellow;
const _ = null;

function sameGrid(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
}

function visibleColors(cubes, face) {
  return visibleCubesFrom(cubes, face).map(c => c.color).sort();
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
