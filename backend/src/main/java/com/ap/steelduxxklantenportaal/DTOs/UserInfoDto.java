package com.ap.steelduxxklantenportaal.DTOs;

import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;

import java.util.List;

public record UserInfoDto(String email, String firstName, String lastName, RoleEnum role, List<PermissionEnum> permissionEnums) {}
