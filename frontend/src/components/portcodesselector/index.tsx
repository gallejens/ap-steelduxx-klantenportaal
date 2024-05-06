import { Select, type SelectProps } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { fetchPostcodes } from './helper';

export const PortcodesSelector: FC<SelectProps> = props => {
  const { data: portcodes } = useQuery({
    queryKey: ['portcodes'],
    queryFn: () => fetchPostcodes(),
  });

  return (
    <Select
      {...props}
      limit={5}
      searchable
      data={portcodes}
    />
  );
};
