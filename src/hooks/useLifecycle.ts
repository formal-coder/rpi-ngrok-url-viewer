import { useEffect, useRef } from 'react';
export function useMount(callback: () => void): void {
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
  }, []);
}
export function useUnmount(callback: () => void): void {
  const callbackRef = useRef(callback);
  // Update ref if callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}
