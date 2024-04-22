package com.ap.steelduxxklantenportaal.utils;

import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;

import java.util.EnumMap;
import java.util.List;

public class PermissionsManager {
        private static PermissionsManager instance;
        private final EnumMap<RoleEnum, List<PermissionEnum>> rolePermissions = new EnumMap<>(RoleEnum.class);

        public PermissionsManager() {
                // Head admin permissions
                rolePermissions.put(RoleEnum.ROLE_HEAD_ADMIN,
                                List.of(
                                                PermissionEnum.ACCESS,
                                                PermissionEnum.VIEW_ACCOUNTS,
                                                PermissionEnum.CREATE_SUB_ACCOUNTS,
                                                PermissionEnum.CREATE_NEW_ORDERS,
                                                PermissionEnum.ADMIN,
                                                PermissionEnum.MANAGE_ORDER_REQUESTS,
                                                PermissionEnum.MANAGE_USER_REQUESTS));

        // Admin permissions
        rolePermissions.put(RoleEnum.ROLE_ADMIN,
                List.of(
                        PermissionEnum.ACCESS,
                        PermissionEnum.VIEW_ACCOUNTS,
                        PermissionEnum.ADMIN,
                        PermissionEnum.MANAGE_USER_REQUESTS,
                        PermissionEnum.MANAGE_ORDER_REQUESTS,
                        PermissionEnum.MANAGE_USER_REQUESTS
                )
        );

                // Head user permissions
                rolePermissions.put(RoleEnum.ROLE_HEAD_USER,
                                List.of(
                                                PermissionEnum.ACCESS,
                                                PermissionEnum.VIEW_ACCOUNTS,
                                                PermissionEnum.CREATE_SUB_ACCOUNTS,
                                                PermissionEnum.CREATE_NEW_ORDERS));

                // Head permissions
                rolePermissions.put(RoleEnum.ROLE_USER,
                                List.of(
                                                PermissionEnum.ACCESS,
                                                PermissionEnum.CREATE_NEW_ORDERS));

                validateAllRolesMapped();
        }

        private void validateAllRolesMapped() throws RuntimeException {
                boolean allMapped = rolePermissions.size() == RoleEnum.class.getEnumConstants().length;
                if (allMapped)
                        return;

                throw new RuntimeException("Not all roles have permissions assigned");
        }

        public static PermissionsManager getInstance() {
                if (instance == null) {
                        instance = new PermissionsManager();
                }

                return instance;
        }

        public List<PermissionEnum> getRolePermissions(RoleEnum role) {
                return rolePermissions.get(role);
        }
}
