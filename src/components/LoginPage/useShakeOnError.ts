import { useEffect, useRef, useState } from 'react';

export function useShakeOnError(error: string | undefined): boolean {
  const [shaking, setShaking] = useState(false);
  const prevError = useRef<string | undefined>();

  useEffect(() => {
    if (error && error !== prevError.current) {
      setShaking(true);
      const timer = window.setTimeout(() => setShaking(false), 450);
      prevError.current = error;
      return () => window.clearTimeout(timer);
    }

    if (!error) {
      prevError.current = undefined;
    }
  }, [error]);

  return shaking;
}
