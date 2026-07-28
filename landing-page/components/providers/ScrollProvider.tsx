'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ScrollContextValue {
  scrollProgress: number; // 0..1
  activeSection: number;  // 0..6
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollProgress: 0,
  activeSection: 0
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<ScrollContextValue>({
    scrollProgress: 0,
    activeSection: 0
  });

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      const section = Math.min(6, Math.floor(progress * 7));
      setValue({ scrollProgress: progress, activeSection: section });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export const useScrollProgress = () => useContext(ScrollContext);
