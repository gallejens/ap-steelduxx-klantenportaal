import { TextInput } from '@mantine/core';
import { useState, type FC, type KeyboardEvent } from 'react';
import styles from './styles/multisearch.module.scss';
import { IconSearch } from '@tabler/icons-react';
import { Pill } from '../pill';

type Props = {
  values: string[];
  onChange: (value: string[]) => void;
  inputWidth: string;
};

export const MultiSearch: FC<Props> = props => {
  const [value, setValue] = useState('');
  const [searches, setSearches] = useState<string[]>([]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (value === '') return;

    setSearches([...searches, value]);
    setValue('');
  };

  return (
    <div className={styles.multisearch}>
      <TextInput
        leftSection={<IconSearch />}
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        onKeyDown={handleKeyPress}
        style={{
          width: props.inputWidth,
        }}
      />
      <div className={styles.pills}>
        {searches.map((value, idx) => (
          <Pill
            key={`searchvalue_${value}`}
            text={value}
            onRemove={() => setSearches(s => s.filter((_, i) => i !== idx))}
          />
        ))}
      </div>
    </div>
  );
};
