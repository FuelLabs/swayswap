import mitt from 'mitt';
import { useEffect } from 'react';

const emitter = mitt();

type Listener<T> = (data: T) => void;

export function useSubscriber<T = unknown>(event: string, listener: Listener<T>, deps = []) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emitter.on(event as any, listener as any);
    return () => emitter.off(event);
  }, deps);
}

export function usePublisher() {
  return emitter;
}
