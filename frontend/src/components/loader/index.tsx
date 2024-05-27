import React from 'react';
import { Loader } from '@mantine/core';
import styles from './styles/loader.module.scss';

interface LoaderComponentProps {
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({
  color = 'rgba(84,80,69)',
  size = 'xl',
}) => {
  return (
    <div className={styles.loader}>
      <Loader
        color={color}
        size={size}
      />
    </div>
  );
};

export default LoaderComponent;
