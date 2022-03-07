import { useEffect, useRef } from 'react';
import { UseResizeObserver } from 'types';

export const useResizeObserver: UseResizeObserver = (ref, callback) => {
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (ref !== null) {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      resizeObserver.current = new ResizeObserver(callback);
      resizeObserver.current.observe(ref);
    }
  }, [ref, callback]);

  useEffect(
    () => () => {
      resizeObserver.current?.disconnect();
    },
    []
  );
};
