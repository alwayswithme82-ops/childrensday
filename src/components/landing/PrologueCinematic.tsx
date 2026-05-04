import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../shared/Button';
import { ComicEffects, type ComicTheme } from './ComicEffects';
import { ComicScene } from './ComicScene';
import { ComicSpeechBubble } from './ComicSpeechBubble';
import { TypingText, type TypingTextHandle } from './TypingText';

interface PrologueScene {
  id: string;
  title: string;
  body: string;
  speaker?: string;
  characterEmoji?: string;
  mainObjectEmoji: string;
  sfxText?: string;
  theme: ComicTheme;
  buttonText: string;
}

const SCENES: PrologueScene[] = [
  {
    id: 'invitation',
    title: '광장에 떨어진 양피지',
    speaker: '?',
    mainObjectEmoji: '📜',
    sfxText: '팔랑!',
    body:
      '어린이날 아침, 색나무 마을 광장.\n바람을 타고 작은 양피지 한 장이\n네 발 앞에 살포시 내려앉았어요.\n\n오래된 글씨로 ‘큐브왕의 메모’라고\n적혀 있었죠.',
    theme: 'invitation',
    buttonText: '메모 펼쳐보기 📜',
  },
  {
    id: 'portal',
    title: '솟아오른 큐브왕의 그림자',
    mainObjectEmoji: '👑',
    sfxText: '쿠구궁!',
    body:
      '메모를 펼치는 순간,\n색깔 큐브들이 광장 위로\n빙글빙글 떠올랐어요!\n\n그 한가운데에서 거대한 큐브왕의\n그림자가 천천히 나타났어요.',
    theme: 'portal',
    buttonText: '큐브왕 만나기 👑',
  },
  {
    id: 'ruby',
    title: '색나무 마을 사람의 부탁',
    speaker: '마을 사람',
    characterEmoji: '🧑‍🌾',
    mainObjectEmoji: '🏛',
    sfxText: '도와줘!',
    body:
      '오래전, 큐브왕은 색나무 마을 한가운데에\n비밀 건물을 짓고 사라졌어.\n\n비밀 건물을 다시 세우는 방법은\n네 장의 메모에만 적혀 있단다.\n어린이 건축가야, 우릴 도와주겠니?',
    theme: 'ruby',
    buttonText: '도와줄게요! ✨',
  },
  {
    id: 'keys',
    title: '네 장의 메모',
    speaker: '큐브왕의 메모',
    mainObjectEmoji: '📜',
    sfxText: '시작!',
    body:
      '비밀 건물을 다시 세우려면\n네 장의 메모를 차례대로 풀어야 해요.\n\n📜 재료 모으기\n📜 색깔이 만나는 규칙\n📜 위에서 본 모습\n📜 숨어 있는 노란 큐브\n\n색나무 마을의 비밀 건물을\n함께 완성해볼까요?',
    theme: 'keys',
    buttonText: '첫 번째 메모 펼치기 📜',
  },
];

const BG: Record<ComicTheme, string> = {
  invitation:
    'radial-gradient(circle at 50% 30%, rgba(255,222,128,0.55), transparent 40%), linear-gradient(160deg, #FFF7AD 0%, #FFD6E7 52%, #FFE8B5 100%)',
  portal:
    'radial-gradient(circle at 50% 50%, rgba(199,125,255,0.55), transparent 38%), linear-gradient(150deg, #1E1B4B 0%, #4338CA 35%, #7C3AED 68%, #C77DFF 100%)',
  ruby:
    'radial-gradient(circle at 50% 30%, rgba(252,211,77,0.45), transparent 40%), linear-gradient(160deg, #CFFAFE 0%, #D1FAE5 52%, #FEF3C7 100%)',
  keys:
    'radial-gradient(circle at 50% 22%, rgba(245,158,11,0.5), transparent 36%), linear-gradient(165deg, #0B1126 0%, #1B2A4A 50%, #B45309 130%)',
};

const PANEL_BG: Record<ComicTheme, string> = {
  invitation: 'linear-gradient(160deg, #FFFCF0 0%, #FFE9F1 100%)',
  portal:     'linear-gradient(160deg, #1F1B5C 0%, #5B36C9 60%, #B581F0 100%)',
  ruby:       'linear-gradient(160deg, #FFFFFF 0%, #ECFEFF 60%, #FEF3C7 100%)',
  keys:       'linear-gradient(160deg, #1A2444 0%, #2C3E72 60%, #B45309 130%)',
};

const TITLE_COLOR: Record<ComicTheme, string> = {
  invitation: '#B45309',
  portal:     '#FCD34D',
  ruby:       '#1E40AF',
  keys:       '#FCD34D',
};

function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);
  return reduce;
}

interface MainObjectProps {
  scene: PrologueScene;
  reduceMotion: boolean;
}

function MainObject({ scene, reduceMotion }: MainObjectProps) {
  const { theme, mainObjectEmoji, sfxText, characterEmoji } = scene;

  if (theme === 'invitation') {
    return (
      <div className="relative flex h-36 items-center justify-center sm:h-44">
        <motion.span
          className="text-7xl drop-shadow-md sm:text-8xl"
          initial={{ y: 90, scale: 0.4, rotate: -16 }}
          animate={
            reduceMotion
              ? { y: 0, scale: 1, rotate: 0 }
              : { y: [0, -10, 0], scale: 1, rotate: [-4, 4, -4] }
          }
          transition={
            reduceMotion
              ? { duration: 0.4 }
              : {
                  scale: { type: 'spring', stiffness: 240, damping: 14 },
                  rotate: { duration: 0.6, type: 'spring', stiffness: 220, damping: 14 },
                  y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          {mainObjectEmoji}
        </motion.span>
        {sfxText && (
          <motion.span
            className="absolute -right-1 top-1 rotate-[14deg] rounded-2xl border-[3px] border-slate-900 bg-yellow-300 px-3 py-1 font-fredoka text-2xl text-rose-600 shadow-[3px_3px_0_rgba(15,23,42,0.95)] sm:-right-3 sm:top-2 sm:text-3xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [1.4, 0.95, 1.05, 1], rotate: 14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {sfxText}
          </motion.span>
        )}
      </div>
    );
  }

  if (theme === 'portal') {
    return (
      <div className="relative flex h-36 items-center justify-center sm:h-44">
        <motion.div
          className="absolute h-36 w-36 rounded-full sm:h-44 sm:w-44"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(167,139,250,0.85), rgba(96,165,250,0.85), rgba(196,181,253,0.85), rgba(167,139,250,0.85))',
            filter: 'blur(2px)',
            opacity: 0.7,
          }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.span
            key={i}
            className="absolute text-2xl"
            style={{ originX: 0.5, originY: 0.5 }}
            initial={{ rotate: i * 60 }}
            animate={reduceMotion ? undefined : { rotate: 360 + i * 60 }}
            transition={reduceMotion ? undefined : { duration: 4 + (i % 3) * 0.6, repeat: Infinity, ease: 'linear' }}
          >
            <span style={{ display: 'inline-block', transform: 'translateY(-3.4rem)' }}>🧊</span>
          </motion.span>
        ))}
        <motion.span
          className="text-7xl drop-shadow-lg sm:text-8xl"
          animate={
            reduceMotion
              ? undefined
              : { rotate: [0, 360], scale: [1, 1.18, 1] }
          }
          transition={
            reduceMotion
              ? undefined
              : { rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }
          }
        >
          {mainObjectEmoji}
        </motion.span>
        {sfxText && (
          <motion.span
            className="absolute -bottom-1 right-2 rotate-[-8deg] rounded-2xl border-[3px] border-slate-900 bg-violet-200 px-3 py-1 font-fredoka text-xl text-indigo-700 shadow-[3px_3px_0_rgba(15,23,42,0.95)] sm:text-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: [1.3, 0.95, 1.05, 1] }}
            transition={{ duration: 0.8 }}
          >
            {sfxText}
          </motion.span>
        )}
      </div>
    );
  }

  if (theme === 'ruby') {
    return (
      <div className="relative flex h-36 items-center justify-center gap-6 sm:h-44">
        <motion.span
          className="text-7xl drop-shadow-md sm:text-8xl"
          initial={{ y: 24, scale: 0.7, opacity: 0 }}
          animate={
            reduceMotion
              ? { y: 0, scale: 1, opacity: 1 }
              : { y: [0, -12, 0], rotate: [-4, 4, -4], opacity: 1, scale: 1 }
          }
          transition={
            reduceMotion
              ? { duration: 0.4 }
              : {
                  scale: { duration: 0.4 },
                  opacity: { duration: 0.3 },
                  y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          {characterEmoji ?? '🧚'}
        </motion.span>
        <motion.span
          className="text-6xl drop-shadow sm:text-7xl"
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: [0.45, 1, 0.45], scale: [0.95, 1.12, 0.95], filter: ['drop-shadow(0 0 4px #fbbf24)', 'drop-shadow(0 0 18px #fbbf24)', 'drop-shadow(0 0 4px #fbbf24)'] }
          }
          transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {mainObjectEmoji}
        </motion.span>
        {sfxText && (
          <motion.span
            className="absolute -top-1 right-3 rotate-[10deg] rounded-2xl border-[3px] border-slate-900 bg-pink-300 px-3 py-1 font-fredoka text-xl text-rose-700 shadow-[3px_3px_0_rgba(15,23,42,0.95)] sm:text-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: [1.4, 0.95, 1.08, 1], rotate: 10 }}
            transition={{ duration: 0.7 }}
          >
            {sfxText}
          </motion.span>
        )}
      </div>
    );
  }

  // keys
  const places = [
    { icon: '🧱', label: '재료' },
    { icon: '🤝', label: '만남' },
    { icon: '☁️', label: '위에서' },
    { icon: '🟨', label: '숨김' },
  ];
  return (
    <div className="flex h-36 flex-col items-center justify-center gap-3 sm:h-44">
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.18 } } }}
        initial="hidden"
        animate="show"
        className="flex items-end gap-2"
      >
        {[0, 1, 2, 3].map(i => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 22, scale: 0.5 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 360, damping: 18 },
              },
            }}
            className="text-4xl drop-shadow-md sm:text-5xl"
          >
            <motion.span
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                      filter: [
                        'drop-shadow(0 0 6px rgba(252,211,77,0.7))',
                        'drop-shadow(0 0 18px rgba(251,191,36,1))',
                        'drop-shadow(0 0 6px rgba(252,211,77,0.7))',
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 1.8, repeat: Infinity, delay: i * 0.18 }
              }
              className="inline-block"
            >
              📜
            </motion.span>
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.13, delayChildren: 0.6 } } }}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {places.map((p, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            className="rounded-full border-[2px] border-slate-900 bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700"
          >
            {p.icon} {p.label}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

interface Props {
  onComplete: () => void;
}

export function PrologueCinematic({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const reduceMotion = useReducedMotion();
  const typingRef = useRef<TypingTextHandle | null>(null);

  const scene = SCENES[index];
  const isLast = index + 1 >= SCENES.length;

  useEffect(() => {
    setTypingDone(false);
  }, [index]);

  const handlePanelClick = () => {
    if (!typingDone) typingRef.current?.reveal();
  };

  const handleNext = () => {
    if (isLast) onComplete();
    else setIndex(i => i + 1);
  };

  return (
    <motion.div
      key="prologue-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 py-8 sm:py-12"
      style={{ background: BG[scene.theme], transition: 'background 600ms ease' }}
    >
      {/* Skip button */}
      <button
        type="button"
        onClick={onComplete}
        aria-label="프롤로그 건너뛰기"
        className="absolute right-4 top-4 z-40 rounded-full border-[2px] border-slate-900 bg-white/90 px-3 py-1.5 font-fredoka text-sm font-bold text-slate-700 shadow-[3px_3px_0_rgba(15,23,42,0.85)] transition-transform hover:scale-105 active:scale-95"
      >
        건너뛰기 »
      </button>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          <ComicScene
            key={scene.id}
            background={PANEL_BG[scene.theme]}
            rotate={index % 2 === 0 ? -0.6 : 0.8}
            onClick={handlePanelClick}
          >
            <ComicEffects theme={scene.theme} reduceMotion={reduceMotion} />

            <div className="relative z-10 flex flex-col items-center gap-5 px-5 py-6 sm:px-8 sm:py-8">
              <p
                className="font-fredoka text-2xl drop-shadow sm:text-3xl"
                style={{ color: TITLE_COLOR[scene.theme] }}
              >
                {index + 1}장 · {scene.title}
              </p>

              <MainObject scene={scene} reduceMotion={reduceMotion} />

              <ComicSpeechBubble speaker={scene.speaker}>
                <TypingText
                  ref={typingRef}
                  text={scene.body}
                  onComplete={() => setTypingDone(true)}
                />
              </ComicSpeechBubble>

              {!typingDone && (
                <p className="text-xs font-bold text-slate-500/80">
                  화면을 누르면 바로 읽을 수 있어요
                </p>
              )}
            </div>
          </ComicScene>
        </AnimatePresence>

        {/* Next button */}
        <div className="min-h-[60px]">
          <AnimatePresence mode="wait">
            {typingDone && (
              <motion.div
                key={`btn-${scene.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Button size="lg" onClick={handleNext} pulse className="min-w-[260px]">
                  {scene.buttonText}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2.5">
          {SCENES.map((s, i) => (
            <motion.span
              key={s.id}
              animate={{
                scale: i === index ? 1.55 : 1,
                backgroundColor: i === index ? '#F59E0B' : i < index ? '#FCD34D' : '#CBD5E1',
                boxShadow:
                  i === index
                    ? '0 0 16px rgba(245,158,11,0.85)'
                    : '0 0 0 rgba(0,0,0,0)',
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="h-2.5 w-2.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
