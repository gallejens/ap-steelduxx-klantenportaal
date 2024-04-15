import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppshellState = {
  sidebarCollapsed: boolean;
};

type AppshellStateActions = {
  setSidebarCollapsed: (
    state:
      | AppshellState['sidebarCollapsed']
      | ((
          state: AppshellState['sidebarCollapsed']
        ) => AppshellState['sidebarCollapsed'])
  ) => void;
};

export const useAppshellStore = create(
  persist<AppshellState & AppshellStateActions>(
    set => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: state =>
        set(s => ({
          sidebarCollapsed:
            typeof state === 'function' ? state(s.sidebarCollapsed) : state,
        })),
    }),
    {
      name: 'appshell',
    }
  )
);
