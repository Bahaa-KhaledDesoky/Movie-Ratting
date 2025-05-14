package com.ratting.movierate.DTOs;

import com.ratting.movierate.Model.TokenResponse;

public record LoginRespond(
        TokenResponse tokenResponse,
        String userRole
) {
}
