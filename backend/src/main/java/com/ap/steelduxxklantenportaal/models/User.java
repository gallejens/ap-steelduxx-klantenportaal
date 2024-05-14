package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.dtos.UserInfoDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.utils.PermissionsManager;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SQLRestriction("deleted=false")
@ToString
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
    private boolean deleted = Boolean.FALSE;

    public User(String email, String password, String firstName, String lastName, RoleEnum role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public List<PermissionEnum> getPermissions() {
        return PermissionsManager.getInstance().getRolePermissions(role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        var rolePermissions = getPermissions();
        authorities.add(new SimpleGrantedAuthority(role.name()));
        authorities.addAll(
                rolePermissions
                        .stream()
                        .map(p -> new SimpleGrantedAuthority(p.name()))
                        .toList());

        return authorities;
    }

    // Email acts as username for our system
    @Override
    public String getUsername() {
        return email;
    }

    public UserInfoDto getUserInfo() {
        return new UserInfoDto(id, email, firstName, lastName, role, getPermissions());
    }

    public boolean hasPermission(PermissionEnum permission) {
        return getPermissions().contains(permission);
    }
}
