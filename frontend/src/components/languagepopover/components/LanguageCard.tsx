import { Card } from '@mantine/core';
import styles from '../styles/languagepopover.module.scss';

interface CustomLanguageCardProps {
  key: any;
  flag: any;
  name: any;
  onClick: () => void;
  isSelected: boolean;
}

export default function CustomLanguageCard(props: CustomLanguageCardProps) {
  return (
    <Card
      className={`${styles.card} ${props.isSelected ? styles.selectedCard : ''}`}
      onClick={props.onClick}
    >
      <div className={styles.box}>
        <div className={styles.flag}>
          <props.flag />
        </div>
        <div className={styles.name}>{props.name}</div>
      </div>
    </Card>
  );
}
