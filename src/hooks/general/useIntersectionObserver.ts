import { useEffect, useRef, useCallback } from 'react';

type IntersectionObserverHookProps = {
  callback: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const useIntersectionObserver = <
  TLastElement extends HTMLElement,
>({
  callback,
  hasNextPage,
  isFetchingNextPage,
}: IntersectionObserverHookProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<TLastElement | null>(null);



  const observe = useCallback(
    (node: TLastElement) => {
      if (isFetchingNextPage || !hasNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          
          console.log('entry :>> ', entry.isIntersecting, entry.intersectionRatio, entry.intersectionRect);
          if (entry.isIntersecting && entry?.intersectionRatio >= 0.8) {
            observerRef.current?.disconnect();
            callback();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.8
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [callback, hasNextPage, isFetchingNextPage]
  );


  useEffect(() => {
    const element = lastElementRef.current;
    if (element) {
      observe(element);
    }
  }, [observe]); // Tambahkan observe ke dependency list


  return { lastElementRef };
};
