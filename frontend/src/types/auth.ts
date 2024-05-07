export namespace Auth {
  export type Role =
    | 'ROLE_HEAD_ADMIN'
    | 'ROLE_ADMIN'
    | 'ROLE_HEAD_USER'
    | 'ROLE_USER';

  export type Permission =
    | 'ACCESS'
    | 'ADMIN'
    | 'VIEW_COMPANIES'
    | 'CREATE_USER_ACCOUNTS'
    | 'CREATE_ADMIN_ACCOUNTS'
    | 'DELETE_USER_ACCOUNTS'
    | 'DELETE_ADMIN_ACCOUNTS'
    | 'CHANGE_COMPANY_HEAD_ACCOUNT'
    | 'CREATE_NEW_ORDERS'
    | 'MANAGE_USER_REQUESTS'
    | 'MANAGE_ORDER_REQUESTS';

  export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    permissions: Permission[];
    role: Role;
  };
}
