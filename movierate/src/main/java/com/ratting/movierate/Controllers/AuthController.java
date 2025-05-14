package com.ratting.movierate.Controllers;

import com.ratting.movierate.DTOs.UserRequest;
import com.ratting.movierate.Mapping.UserMapping;
import com.ratting.movierate.Model.RefreshTokenRequest;
import com.ratting.movierate.Model.TokenResponse;
import com.ratting.movierate.Model.User;
import com.ratting.movierate.ServiceImpl.AuthService;
import com.ratting.movierate.ServiceImpl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserServiceImpl userServiceImp;
    private final UserMapping mapping;
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserRequest signIn) {

        try {
            if (userServiceImp.userExist(signIn.username())) {
                return ResponseEntity.status(HttpStatus.IM_USED)
                        .body("This user name is taken");
            }
            User user =mapping.requestToUser(signIn);
            userServiceImp.Register(user);
            user=userServiceImp.getUserByUserName(signIn.username());

            return ResponseEntity.ok(user);
        }
        catch(Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request");
        }

    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest logInRequest) {

        try {
            if (!userServiceImp.userExist(logInRequest.username())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("wrong user name");
            }
            User user=userServiceImp.getUserByUserName(logInRequest.username());
            if(!user.getPassword().equals(logInRequest.password()))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("wrong password");

            TokenResponse tokenResponse=authService.getRefreshToken(user.getUsername());
            user.setRefreshToken(tokenResponse.getRefreshToken());
            userServiceImp.addUser(user);

            return ResponseEntity.ok(tokenResponse);
        }
        catch(Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request");
        }

    }

    @GetMapping("/access/{refresh}")
    public ResponseEntity<?> getAccessToken(@PathVariable String refresh) {
       return ResponseEntity.ok(authService.accessToken(
               RefreshTokenRequest.builder()
                       .refreshToken(refresh)
                       .build()).getAccessToken());
    }

    }