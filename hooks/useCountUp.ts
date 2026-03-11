'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountUp(target: number, duration: number = 1500): { value: number; ref: (node: HTMLElement | null) => void } {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;

      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(update);
  }, [target, duration]);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;

    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [animate]);

  return { value, ref };
}
