import { TextInput } from '@mantine/core';
import { useState, type FC, type KeyboardEvent } from 'react';
import styles from './styles/multisearch.module.scss';
import { IconSearch } from '@tabler/icons-react';
import { Pill } from '../pill';
import { useTranslation } from 'react-i18next';

type Props = {
  onChange: (value: string[]) => void;
  inputWidth: string;
};

export const MultiSearch: FC<Props> = props => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [searches, setSearches] = useState<string[]>([]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (value === '') return;

    const newSearches = [...searches, value];
    setSearches(newSearches);
    setValue('');

    props.onChange(newSearches);
  };

  const handleInputChange = (newValue: string) => {
    setValue(newValue);

    props.onChange([newValue, ...searches]);
  };

  const handleRemoveSearch = (idx: number) => {
    const newSearches = searches.filter((_, i) => i !== idx);
    setSearches(newSearches);

    props.onChange([value, ...newSearches]);
  };

  return (
    <div className={styles.multisearch}>
      <TextInput
        leftSection={<IconSearch />}
        value={value}
        onChange={e => handleInputChange(e.currentTarget.value)}
        onKeyDown={handleKeyPress}
        style={{
          width: props.inputWidth,
        }}
        placeholder={t('multisearch:inputPlaceholder')}
      />
      <div className={styles.pills}>
        {searches.map((value, idx) => (
          <Pill
            key={`searchvalue_${value}`}
            text={value}
            onRemove={() => handleRemoveSearch(idx)}
          />
        ))}
      </div>
    </div>
  );
};
