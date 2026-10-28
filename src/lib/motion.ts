import { useCallback, useEffect, useState } from 'react';

const KEY = 'receipts:motion';

function initialMotion(): boolean {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved === 'on';
  } catch {
    /* storage unavailable */
  }
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function useMotion(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(initialMotion);

  useEffect(() => {
    document.documentElement.dataset.motion = on ? 'on' : 'off';
  }, [on]);

  const set = useCallback((next: boolean) => {
    setOn(next);
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {
      /* storage unavailable */
    }
  }, []);

  return [on, set];
}

export function useReveal(): void {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
