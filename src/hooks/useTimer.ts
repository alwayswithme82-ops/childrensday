import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);
  const sceneStartRef = useRef(0);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        timeRef.current += 1;
        setTime(timeRef.current);
      }, 1000);
    } else {
      clearInterval_();
    }
    return clearInterval_;
  }, [isRunning, clearInterval_]);

  const start = useCallback(() => {
    clearInterval_();
    timeRef.current = 0;
    sceneStartRef.current = 0;
    setTime(0);
    setIsRunning(true);
  }, [clearInterval_]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    clearInterval_();
    timeRef.current = 0;
    sceneStartRef.current = 0;
    setTime(0);
    setIsRunning(false);
  }, [clearInterval_]);

  const markSceneStart = useCallback(() => {
    sceneStartRef.current = timeRef.current;
  }, []);

  const getElapsed = useCallback(() => timeRef.current - sceneStartRef.current, []);

  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }, []);

  return { time, isRunning, start, pause, resume, stop, reset, formatTime, markSceneStart, getElapsed };
}
