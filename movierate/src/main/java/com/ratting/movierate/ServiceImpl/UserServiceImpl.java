package com.ratting.movierate.ServiceImpl;

import com.ratting.movierate.DTOs.LoginRespond;
import com.ratting.movierate.DTOs.UserRequest;
import com.ratting.movierate.Exceptions.UserNotFoundException;
import com.ratting.movierate.Exceptions.WrongPasswordException;
import com.ratting.movierate.Model.TokenResponse;
import com.ratting.movierate.Model.User;
import com.ratting.movierate.Repository.UserRepositiory;
import com.ratting.movierate.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepositiory userRepositiory;
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Override
    public Long Register(User request) {
        if(!userExist(request.getUsername()))
        {

            String hashpassword=hashPassword(request.getPassword());
            request.setPassword(hashpassword);
            int size = userRepositiory.findAll().size();
            if(size==0)
                request.setRole("ADMIN");
            return userRepositiory.save(request).getId();
        }
        else
            return null;
    }

    public Long addUser(User request) {
            return userRepositiory.save(request).getId();
    }
    @Override
    public User Login(UserRequest request) {
        try {
            if (!userExist(request.username())) {
                throw new UserNotFoundException(request.username());
            }
            User user=getUserByUserName(request.username());
            if(!matches(request.password(),user.getPassword()))
                throw new WrongPasswordException();
            return user;
        }
        catch(Exception e) {
            throw new RuntimeException();
        }

    }

    @Override
    public boolean userExist(Long id) {
        if(userRepositiory.findById(id).isPresent())
        {
            return true;
        }
        return false;
    }
    public boolean userExist(String username) {
        if(userRepositiory.findByUsername(username).isPresent())
        {
            return true;
        }
        return false;
    }

    @Override
    public User getUser(Long id) {
        User user =userRepositiory.findById(id).orElseThrow(()->new UserNotFoundException(id));
        return user;
    }

    @Override
    public User getUserByUserName(String username) {

        User user =userRepositiory.findByUsername(username).orElseThrow(()->new UserNotFoundException(username));
        return user;
    }
    private static String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    private static boolean matches(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

}
