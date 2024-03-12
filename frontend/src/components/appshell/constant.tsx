import {
  IconHome,
  IconList,
  IconBaselineDensityMedium,
} from '@tabler/icons-react';

export const TABS = [
  {
    labelKey: 'home',
    path: 'home',
    icon: <IconHome color='rgb(36, 136, 244)' />,
    color: 'rgba(142, 150, 255, 0.433)',
  },
  {
    labelKey: 'orders',
    path: 'orders',
    icon: <IconBaselineDensityMedium color='rgb(36, 244, 112)' />,
    color: 'rgba(142, 255, 210, 0.433)',
  },
  {
    labelKey: 'requests',
    path: 'requests',
    icon: <IconList color='rgb(219, 38, 183)' />,
    color: 'rgba(255, 142, 247, 0.433)',
  },
] satisfies {
  labelKey: string;
  path: string;
  icon: JSX.Element;
  color: string;
}[];
