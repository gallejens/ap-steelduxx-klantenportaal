package com.ap.steelduxxklantenportaal.enums;

public enum PermissionEnum {
    ACCESS, // Every role has this, use to check if user is authenticated,
    ADMIN, // Can use for external api admin func, check new subaccount target, ...
    VIEW_COMPANIES, // Can access companies overview page
    CREATE_USER_ACCOUNTS, // Can create accounts with ROLE_USER role
    CREATE_ADMIN_ACCOUNTS, // Can create accounts with ROLE_ADMIN role
    DELETE_USER_ACCOUNTS, // Can delete accounts with ROLE_USER role
    DELETE_ADMIN_ACCOUNTS, // Can delete accounts with ROLE_ADMIN role
    CHANGE_COMPANY_HEAD_ACCOUNT, // Can change head account of a company
    CREATE_NEW_ORDERS, // Can create orders
    MANAGE_USER_REQUESTS, // Access & manage user requests
    MANAGE_ORDER_REQUESTS // Access & manage order requests
}
