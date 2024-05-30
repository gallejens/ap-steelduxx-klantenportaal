import {
  type TablerIconsProps,
  IconHome,
  IconFiles,
  IconFilePlus,
  IconUserPlus,
  IconListDetails,
} from '@tabler/icons-react';
import type { FC } from 'react';
import type { Auth } from './types/auth';
import type { RGB } from './types/util';

export const TABS: {
  labelKey: string; // appshell:tabs:xxx in i18n files
  path: `/app/${string}`;
  icon: FC<TablerIconsProps>;
  color: RGB;
  requiredPermission?: Auth.Permission;
  showOnHomepage?: boolean;
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
    icon: IconFiles,
    color: { r: 36, g: 244, b: 112 },
    showOnHomepage: true,
  },
  {
    labelKey: 'orderrequests',
    path: '/app/order-requests',
    icon: IconFilePlus,
    color: { r: 205, g: 98, b: 0 },
    requiredPermission: 'MANAGE_ORDER_REQUESTS',
    showOnHomepage: true,
  },
  {
    labelKey: 'requests',
    path: '/app/requests',
    icon: IconUserPlus,
    color: { r: 219, g: 38, b: 183 },
    requiredPermission: 'MANAGE_USER_REQUESTS',
    showOnHomepage: true,
  },
  {
    labelKey: 'companies',
    path: '/app/companies',
    icon: IconListDetails,
    color: { r: 219, g: 38, b: 38 },
    requiredPermission: 'VIEW_COMPANIES',
    showOnHomepage: true,
  },
];
