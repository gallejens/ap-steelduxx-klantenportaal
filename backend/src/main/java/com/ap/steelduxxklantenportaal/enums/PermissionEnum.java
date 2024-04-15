package com.ap.steelduxxklantenportaal.enums;

public enum PermissionEnum {
    ACCESS, // Every role has this, use to check if user is authenticated
    VIEW_ACCOUNTS, // Can access accounts overview page
    CREATE_SUB_ACCOUNTS, // Can create subaccounts
    EXTERNAL_API_ADMIN, // Use admin key for external functionality
}
