package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.hscodes.HsCodeApiResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class HsCodesService {

    private final RestTemplate restTemplate;

    private final String[] labelEndingTrimStrings = {" &hellip;", ", of", ","};

    public HsCodesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, String> getSuggestions(String term) {
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        var suggestions = new HashMap<String, String>();

        try {
            ResponseEntity<HsCodeApiResponse> response = restTemplate.exchange("https://www.tariffnumber.com/api/v1/cnSuggest?lang=en&term=" + term, HttpMethod.GET, entity, HsCodeApiResponse.class);
            var data = response.getBody();
            if (data == null || data.total() == 0) return suggestions;

            for (var sug : data.suggestions()) {
                suggestions.put(sug.code(), getLabelFromSuggestion(sug.value()));
            }
            return suggestions;
        } catch (RestClientException e) {
            return suggestions;
        }
    }

    private String getLabelFromSuggestion(String suggestionValue) {
        String label = suggestionValue.replaceAll(".+<br>", "").trim(); // remove everything up until <br> after which starts the label

        for (var trimString : labelEndingTrimStrings) {
            boolean endsWith = label.endsWith(trimString);
            if (!endsWith) continue;
            label = label.substring(0, label.lastIndexOf(trimString)).trim();
        }

        return label;
    }
}
