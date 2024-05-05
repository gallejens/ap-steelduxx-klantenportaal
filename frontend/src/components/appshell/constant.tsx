import type { Auth } from '@/types/auth';
import type { RGB } from '@/types/util';
import {
  IconHome,
  IconBaselineDensityMedium,
  IconUsers,
  type TablerIconsProps,
} from '@tabler/icons-react';
import type { FC } from 'react';

export const SIDEBAR_WIDTH: number = 17; // in rem

export const TABS: {
  labelKey: string; // appshell:tabs:xxx in i18n files
  path: `/app/${string}`;
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
    labelKey: 'orderrequests',
    path: '/app/order-requests',
    icon: IconBaselineDensityMedium,
    color: { r: 205, g: 98, b: 0 },
    requiredPermission: 'MANAGE_ORDER_REQUESTS',
  },
  {
    labelKey: 'requests',
    path: '/app/requests',
    icon: IconBaselineDensityMedium,
    color: { r: 219, g: 38, b: 183 },
    requiredPermission: 'MANAGE_USER_REQUESTS',
  },
  {
    labelKey: 'accounts',
    path: '/app/accounts',
    icon: IconUsers,
    color: { r: 150, g: 255, b: 0 },
    requiredPermission: 'VIEW_ACCOUNTS',
  },
];
