package com.ratting.movierate.Mapping;

import com.ratting.movierate.DTOs.UserRequest;
import com.ratting.movierate.Model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapping {

    public User requestToUser(UserRequest request)
    {
        return User.builder()
                .username(request.username())
                .password(request.password())
                .role("USER")
                .build();
    }
}
