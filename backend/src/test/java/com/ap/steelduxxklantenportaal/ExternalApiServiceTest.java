package com.ap.steelduxxklantenportaal;

import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.security.test.context.support.WithUserDetails;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class ExternalApiServiceTest {
    @Autowired
    private ExternalApiService externalApiService;

    @Test
    @WithUserDetails(value = "sw03.ap@gmail.com")
    void givenRequest_whenCallingExternalApi_thenGetResponse() {
        var result = externalApiService.doRequest("/admin/order/all", HttpMethod.GET, OrderDto[].class);
        assertThat(result).isNotNull();
    }
}
