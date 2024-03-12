export namespace Auth {
  type Role = 'ROLE_HEAD_ADMIN' | 'ROLE_ADMIN' | 'ROLE_HEAD_USER' | 'ROLE_USER';

  type Permission =
    | 'ACCESS'
    | 'MANAGE_USERS'
    | 'MANAGE_ADMINS'
    | 'MANAGE_COMPANIES'
    | 'LOG_ACCESS';

  export type User = {
    email: string;
    firstName: string;
    lastName: string;
    permissions: Permission[];
    role: Role;
  };
}
