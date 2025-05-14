package com.ratting.movierate.ServiceImpl;

import com.ratting.movierate.DTOs.UserRequest;
import com.ratting.movierate.Exceptions.UserNotFoundException;
import com.ratting.movierate.Model.User;
import com.ratting.movierate.Repository.UserRepositiory;
import com.ratting.movierate.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepositiory userRepositiory;
    @Override
    public Long Register(User request) {
        if(!userExist(request.getUsername()))
        {

            return userRepositiory.save(request).getId();
        }
        else
            return null;
    }

    public Long addUser(User request) {
            return userRepositiory.save(request).getId();
    }
    @Override
    public Long Login(UserRequest request) {
        User user =getUserByUserName(request.username());
        if(request.password().equals(user.getPassword()))
        {
            return user.getId();
        }
        return null;
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
}
