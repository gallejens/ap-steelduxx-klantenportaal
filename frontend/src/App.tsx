import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC } from 'react';
import { TestValuesPage } from './features/testvaluespage';

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TestValuesPage />
    </QueryClientProvider>
  );
};
