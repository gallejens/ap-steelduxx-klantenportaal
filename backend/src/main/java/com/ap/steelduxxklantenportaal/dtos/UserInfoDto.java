package com.ap.steelduxxklantenportaal.dtos;

import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;

import java.util.List;

public record UserInfoDto(Long id,String email, String firstName, String lastName, RoleEnum role,
                          List<PermissionEnum> permissionEnums) {
}
