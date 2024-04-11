import classNames from 'classnames';
import type { FC } from 'react';
import styles from './styles/steellogo.module.scss';

type Props = {
  width?: string;
  height?: string;
  className?: string;
};

export const SteelLogo: FC<Props> = props => {
  return (
    <div
      className={classNames(styles.steel_logo, props.className)}
      style={{ width: props.width, height: props.height }}
    >
      <img
        src='/steel_background.png'
        alt='steelduxx logo'
        className={styles.background}
      />
    </div>
  );
};
