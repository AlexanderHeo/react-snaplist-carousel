import * as React from 'react';
import { mergeStyles } from './utils';

import styles from './styles.css';

interface CarouselProps {
  direction: 'horizontal' | 'vertical';
  disableScroll?: boolean;
  width?: string;
  height?: string;
  scrollPadding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  className?: string;
}

const SnapListComponent: React.FC<CarouselProps> = (
  { children, direction = 'horizontal', disableScroll = false, width, height, scrollPadding, className },
  ref: React.Ref<HTMLDivElement>,
) => (
  <div
    className={mergeStyles(
      styles.snaplist,
      styles[`snaplist_${direction}`],
      disableScroll ? styles.snaplist_scroll_disabled : styles[`snaplist_scroll_${direction}`],
      className,
    )}
    style={{
      width,
      height,
      scrollPaddingTop: scrollPadding?.top,
      scrollPaddingRight: scrollPadding?.right,
      scrollPaddingBottom: scrollPadding?.bottom,
      scrollPaddingLeft: scrollPadding?.left,
    }}
    ref={ref}
  >
    {children}
  </div>
);

type WithChildren<T> = T & { children?: React.ReactNode };

export const SnapList = React.forwardRef<HTMLDivElement, WithChildren<CarouselProps>>(SnapListComponent);

export const SnapItem: React.FC<{
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  width?: string;
  height?: string;
  snapAlign: 'start' | 'center' | 'end' | 'none';
  forceStop?: boolean;
  className?: string;
}> = ({ children, padding, snapAlign = 'center', forceStop = false, width, height, className }) => (
  <div
    className={mergeStyles(
      styles.snapitem,
      styles[`snapitem_align_${snapAlign}`],
      forceStop ? styles.snapitem_forcestop : null,
      className,
    )}
    style={{
      paddingTop: padding?.top,
      paddingRight: padding?.right,
      paddingBottom: padding?.bottom,
      paddingLeft: padding?.left,
      width,
      height,
    }}
  >
    {children}
  </div>
);
