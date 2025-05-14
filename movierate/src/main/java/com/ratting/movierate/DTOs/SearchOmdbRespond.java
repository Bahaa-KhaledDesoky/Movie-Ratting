package com.ratting.movierate.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SearchOmdbRespond(
        @JsonProperty("Search") List<MoverRespondOmdb> searchResults,
        @JsonProperty("totalResults") String totalResults,
        @JsonProperty("Response") String response
        ) {
}
