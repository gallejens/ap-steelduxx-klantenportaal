package com.ap.steelduxxklantenportaal.utils;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

@SpringBootTest
public class ResponseHandlerTest {
    @Test
    void should_returnCorrectResponseEntity_when_generating() {
        ResponseEntity<Object> responseEntity = ResponseHandler.generate("testMessage", HttpStatus.OK, List.of("item1", "item2"));

        assertThat(responseEntity.hasBody()).isTrue();
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
