package com.ap.steelduxxklantenportaal.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.Charset;

@Service
public class PortcodesService {

    private final String postcodesJson;

    public PortcodesService(@Value("classpath:static/portcodes.json") Resource resource) throws IOException {
        postcodesJson = resource.getContentAsString(Charset.defaultCharset());
    }

    public String getAllPortcodes() {
        return postcodesJson;
    }
}
