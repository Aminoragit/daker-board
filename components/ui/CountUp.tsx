'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface CountUpProps {
  target: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({ target, duration = 1500, decimals = 0, prefix = '', suffix = '', className }: CountUpProps) {
  const { value, ref } = useCountUp(target, duration);

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={className}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}{suffix}
    </span>
  );
}
