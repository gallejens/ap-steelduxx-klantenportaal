import { Autocomplete, type AutocompleteProps } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { fetchHsCodeSuggestions } from './helpers';
import { useDebouncedValue } from '@mantine/hooks';

export const HsCodeSelector: FC<
  AutocompleteProps & {
    onSuggestionAccept: (hsCode: string, label: string) => void;
  }
> = props => {
  const [debouncedSearchValue] = useDebouncedValue(props.value ?? '', 300);

  const { data: suggestions } = useQuery({
    queryKey: ['hsCodeSuggestions', debouncedSearchValue],
    queryFn: () => fetchHsCodeSuggestions(debouncedSearchValue),
  });

  const handleOptionSubmit = (value: string) => {
    const label = suggestions?.[value];
    if (!label) return;

    props.onSuggestionAccept(value, label);
  };

  return (
    <Autocomplete
      {...props}
      data={Object.keys(suggestions ?? {})}
      onOptionSubmit={handleOptionSubmit}
      renderOption={({ option }) => {
        const label = suggestions?.[option.value] ?? '';
        return `${option.value} - ${label}`;
      }}
    />
  );
};
