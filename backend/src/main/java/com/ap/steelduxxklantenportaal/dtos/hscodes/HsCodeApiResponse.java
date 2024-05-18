package com.ap.steelduxxklantenportaal.dtos.hscodes;

public record HsCodeApiResponse(
        String query,
        String year,
        String lang,
        long total,
        HsCodeApiSuggestion[] suggestions
) {
}