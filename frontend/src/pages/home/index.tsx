import type { FC } from 'react';
import styles from './styles/home.module.scss';
import { Body } from './components/body';
import { Header } from './components/header';

export const HomePage: FC = () => {
  return (
    <div className={styles.home_page}>
      <Header></Header>
      <Body></Body>
    </div>
  );
};
