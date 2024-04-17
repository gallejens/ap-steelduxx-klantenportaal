export namespace Auth {
  export type Role =
    | 'ROLE_HEAD_ADMIN'
    | 'ROLE_ADMIN'
    | 'ROLE_HEAD_USER'
    | 'ROLE_USER';

  export type Permission =
    | 'ACCESS'
    | 'ADMIN'
    | 'CREATE_SUB_ACCOUNTS'
    | 'VIEW_ACCOUNTS'
    | 'MANAGE_USER_REQUESTS';

  export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    permissions: Permission[];
    role: Role;
  };
}
