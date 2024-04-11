import type { RGB } from '@/types/util';
import {
  IconHome,
  IconList,
  IconBaselineDensityMedium,
  type TablerIconsProps,
} from '@tabler/icons-react';
import type { FC } from 'react';

export const SIDEBAR_WIDTH = '17rem';

export const TABS = [
  {
    labelKey: 'home',
    path: 'home',
    icon: IconHome,
    iconColor: { r: 36, g: 136, b: 244 },
    color: 'rgba(142, 150, 255, 0.433)',
  },
  {
    labelKey: 'orders',
    path: 'orders',
    icon: IconBaselineDensityMedium,
    iconColor: { r: 36, g: 244, b: 112 },
    color: 'rgba(142, 255, 210, 0.433)',
  },
  {
    labelKey: 'requests',
    path: 'requests',
    icon: IconList,
    iconColor: { r: 219, g: 38, b: 183 },
    color: 'rgba(255, 142, 247, 0.433)',
  },
] satisfies {
  labelKey: string; // appshell:tabs:xxx in i18n files
  path: string; // autoprefixed with /app/
  icon: FC<TablerIconsProps>;
  iconColor: RGB;
  color: string;
}[];
