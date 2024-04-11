import type { Auth } from '@/types/auth';
import type { RGB } from '@/types/util';
import {
  IconHome,
  IconList,
  IconBaselineDensityMedium,
  type TablerIconsProps,
} from '@tabler/icons-react';
import type { FC } from 'react';

export const SIDEBAR_WIDTH: number = 17; // in rem

export const TABS: {
  labelKey: string; // appshell:tabs:xxx in i18n files
  path: string; // autoprefixed with /app/
  icon: FC<TablerIconsProps>;
  color: RGB;
  requiredPermission?: Auth.Permission;
}[] = [
  {
    labelKey: 'home',
    path: '/app/home',
    icon: IconHome,
    color: { r: 36, g: 136, b: 244 },
  },
  {
    labelKey: 'orders',
    path: '/app/orders',
    icon: IconBaselineDensityMedium,
    color: { r: 36, g: 244, b: 112 },
  },
  {
    labelKey: 'requests',
    path: '/app/requests',
    icon: IconList,
    color: { r: 219, g: 38, b: 183 },
  },
];
