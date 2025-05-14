package com.ratting.movierate.ServiceImpl;

import com.ratting.movierate.Model.RefreshTokenRequest;
import com.ratting.movierate.Model.TokenResponse;
import com.ratting.movierate.Security.CustomUserDetails;
import com.ratting.movierate.Security.CustomUserDetailsService;
import com.ratting.movierate.Security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {


    private final JwtUtils jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public TokenResponse accessToken(RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        if (jwtUtil.validateToken(refreshToken)) {
            String username = jwtUtil.extractUserName(refreshToken);
            String newAccessToken = jwtUtil.generateToken(username);
            return new TokenResponse(refreshTokenRequest.getRefreshToken(),newAccessToken);
        } else {
            throw new RuntimeException("Invalid refresh token");
        }
    }
    public TokenResponse getRefreshToken(String username) {
            CustomUserDetails customUserDetails =  userDetailsService.loadUserByUsername(username);
            String newAccessToken = jwtUtil.generateToken(username);
            String newRefreshToken = jwtUtil.generateRefreshToken(username);
            return new TokenResponse(newRefreshToken, newAccessToken);

    }

}