package com.ap.steelduxxklantenportaal.enums;

public enum PermissionEnum {
    ACCESS, // Every role has this, use to check if user is authenticated
    MANAGE_USERS, // Can access user overview page
    MANAGE_ADMINS, // Can create/manage admin accounts
    MANAGE_COMPANIES, // Can create/manage companies
    LOG_ACCESS // Can access logs
}
