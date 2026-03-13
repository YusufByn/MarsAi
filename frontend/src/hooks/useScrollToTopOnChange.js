import { useEffect } from 'react';

export default function useScrollToTopOnChange(dep, options = {}) {
  const { smooth = true } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (smooth) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [dep, smooth]);
}