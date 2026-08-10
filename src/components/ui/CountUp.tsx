import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({ to, duration = 1.5, suffix = '', className }) => {
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(to);
      return;
    }

    let start = 0;
    const end = Math.floor(to);
    if (start === end) {
      setCount(to);
      return;
    }

    let totalMiliseconds = duration * 1000;
    let incrementTime = totalMiliseconds / end;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [to, duration, reducedMotion]);

  return <span className={className}>{count}{suffix}</span>;
};

export default CountUp;
