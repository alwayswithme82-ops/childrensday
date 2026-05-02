import { useMemo } from 'react';

export function useBoothMode(): boolean {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('booth') === 'true';
  }, []);
}
