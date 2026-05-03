import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';

export interface TypingTextHandle {
  reveal: () => void;
  isDone: () => boolean;
}

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  cursorClassName?: string;
  ref?: Ref<TypingTextHandle>;
}

export function TypingText({
  text,
  speed = 22,
  onComplete,
  className = '',
  cursorClassName = 'ml-0.5 inline-block animate-pulse text-amber-500',
  ref,
}: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    completedRef.current = false;
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    if (text.length === 0) {
      setDone(true);
      completedRef.current = true;
      onCompleteRef.current?.();
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDone(true);
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed]);

  useImperativeHandle(ref, () => ({
    reveal: () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayed(text);
      setDone(true);
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    },
    isDone: () => done,
  }), [text, done]);

  return (
    <span className={className}>
      <span className="whitespace-pre-line break-keep">{displayed}</span>
      {!done && <span aria-hidden className={cursorClassName}>|</span>}
    </span>
  );
}
