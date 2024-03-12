package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;

@Entity
@Table(name = "test_values")
public class TestValue {

    public TestValue() {
    }

    public TestValue(Long id, String value) {
        this.id = id;
        this.value = value;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String value;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "TestValue {" + "id=" + id + ", value=" + value + '}';
    }
}
