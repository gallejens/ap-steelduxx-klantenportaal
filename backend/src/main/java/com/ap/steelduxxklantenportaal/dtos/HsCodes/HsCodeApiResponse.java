package com.ap.steelduxxklantenportaal.dtos.HsCodes;

public record HsCodeApiResponse(String query, String year, String lang, long total, HsCodeApiSuggestion[] suggestions) {
}


