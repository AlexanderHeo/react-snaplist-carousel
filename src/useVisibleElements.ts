import { useEffect, useState, useCallback, RefObject } from 'react';

import { mapItem } from './utils';

const debounceHOF = (callback: () => void, ms: number) => {
  let timeout: any;
  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      callback();
    }, ms);
  };
};

export const getVisibleChildren = ($viewport?: HTMLDivElement | null) => {
  if (!$viewport) return [];
  const viewport = {
    from: $viewport.scrollLeft,
    width: $viewport.offsetWidth,
    to: $viewport.scrollLeft + $viewport.offsetWidth,
    offsetLeft: $viewport.offsetLeft,
  };
  const children = [];
  const $items = $viewport.children;

  for (let index = 0; index < $items.length; index++) {
    const $item = $items[index] as HTMLElement;
    const item = mapItem({ $item, viewport });
    const isVisible = item.from >= viewport.from && item.to <= viewport.to;
    if (isVisible) {
      children.push(index);
    }
  }

  return children;
};

export const useVisibleElements = <T>(
  {
    debounce = 100,
    ref,
  }: {
    ref: RefObject<HTMLDivElement>;
    debounce?: number;
  },
  selector: (elements: number[]) => T,
): T => {
  const [visibleChildren, setVisibleChildren] = useState<number[]>([0]);

  const onChange = useCallback(() => {
    const newVisibleChildren = getVisibleChildren(ref.current);
    setVisibleChildren((visibleChildren: number[]) => {
      return newVisibleChildren.length > 0 && JSON.stringify(newVisibleChildren) !== JSON.stringify(visibleChildren)
        ? newVisibleChildren
        : visibleChildren;
    });
  }, [ref]);

  const onChangeWithDebounce = useCallback(debounceHOF(onChange, debounce), [onChange]);

  useEffect(() => {
    const element = ref.current;
    element?.addEventListener('scroll', onChangeWithDebounce);
    window.addEventListener('resize', onChangeWithDebounce);
    window.addEventListener('orientationchange', onChangeWithDebounce);
    onChangeWithDebounce();
    return () => {
      element?.removeEventListener('scroll', onChangeWithDebounce);
      window.removeEventListener('resize', onChangeWithDebounce);
      window.removeEventListener('orientationchange', onChangeWithDebounce);
    };
  }, [onChangeWithDebounce, ref]);

  return selector(visibleChildren);
};
