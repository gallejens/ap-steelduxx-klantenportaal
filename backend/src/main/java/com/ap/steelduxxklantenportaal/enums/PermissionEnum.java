package com.ap.steelduxxklantenportaal.enums;

public enum PermissionEnum {
    ACCESS, // Every role has this, use to check if user is authenticated,
    ADMIN, // Can use for external api admin func, check new subaccount target, ...
    VIEW_ACCOUNTS, // Can access accounts overview page
    CREATE_SUB_ACCOUNTS, // Can create subaccounts
    MANAGE_USER_REQUESTS, // Access & manage user requests
}
