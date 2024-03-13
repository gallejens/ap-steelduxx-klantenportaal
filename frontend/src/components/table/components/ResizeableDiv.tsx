import classNames from 'classnames';
import {
  useEffect,
  useRef,
  type ComponentProps,
  type FC,
  type PropsWithChildren,
} from 'react';
import styles from '../styles/table.module.scss';

const MOVE_INFO = {
  eventKey: 'clientX',
  rectKey: 'left',
  styleKey: 'width',
  multiplier: 1,
} as const;

type Props = ComponentProps<'div'> & {
  storageKey?: string;
  disable?: boolean;
  initialWidth: string;
  maxWidth: string;
  minWidth: string;
};

const STORAGE_KEY_PREFIX = 'resizeable-div-';

const getStorageKey = (storageKey: string) => {
  return `${STORAGE_KEY_PREFIX}${storageKey}`;
};

export const ResizeableDiv: FC<PropsWithChildren<Props>> = ({
  children,
  storageKey,
  disable,
  initialWidth,
  maxWidth,
  minWidth,
  ...divProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseDownRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // load saved size in storage if key is provided
    if (storageKey) {
      const savedWidth = localStorage.getItem(getStorageKey(storageKey));

      if (savedWidth) containerRef.current.style.width = savedWidth;
    }

    // register mouseup handler, seperate from other useEffect to fix quick click not registering
    const mouseUpHandler = () => {
      if (!containerRef.current) return;

      if (storageKey && mouseDownRef.current) {
        const value = containerRef.current.style[MOVE_INFO.styleKey];
        localStorage.setItem(getStorageKey(storageKey), value);
      }

      mouseDownRef.current = false;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!containerRef.current || !mouseDownRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const movement = e[MOVE_INFO.eventKey];
      const newCoord =
        (movement - containerRect[MOVE_INFO.rectKey]) * MOVE_INFO.multiplier;

      containerRef.current.style[MOVE_INFO.styleKey] = `${newCoord}px`;
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return (
    <div
      {...divProps}
      ref={containerRef}
      className={classNames(divProps.className, styles.resizeable_div)}
      style={{
        width: initialWidth,
        minWidth: minWidth ?? '75px',
        maxWidth,
      }}
    >
      {children}
      <div
        className={styles.overlay}
        onMouseDown={() => {
          mouseDownRef.current = true;
        }}
      />
    </div>
  );
};
