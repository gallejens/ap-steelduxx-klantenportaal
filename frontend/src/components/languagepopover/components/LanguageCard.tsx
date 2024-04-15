import { Card } from '@mantine/core';
import styles from '../styles/languagepopover.module.scss';

interface CustomLanguageCardProps {
  key: any;
  flag: any;
  name: any;
  onClick: () => void;
}

export default function CustomLanguageCard({
  flag,
  name,
  onClick,
}: CustomLanguageCardProps) {
  return (
    <Card
      className={styles.card}
      onClick={onClick}
    >
      <div className={styles.box}>
        <div className={styles.flag}>{flag}</div>
        <div className={styles.name}>{name}</div>
      </div>
    </Card>
  );
}
