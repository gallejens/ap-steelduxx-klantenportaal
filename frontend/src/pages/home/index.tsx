import type { FC } from 'react';
import styles from './styles/home.module.scss';
import { Body } from './components/body';
import { Header } from './components/header';
import { Divider } from '@mantine/core';

export const HomePage: FC = () => {
  return (
    <div className={styles.home_page}>
      <Header />
      <Divider orientation='horizontal' />
      <Body />
    </div>
  );
};
