package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TestValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String value;
}
