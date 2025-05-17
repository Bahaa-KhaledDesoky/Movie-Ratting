package com.ratting.movierate.Service;

import com.ratting.movierate.DTOs.UserRequest;
import com.ratting.movierate.Model.User;


public interface UserService {
   public Long Register(User request);
   public User Login(UserRequest request);
   public boolean userExist(Long id);
   public User getUser(Long id);
   public User getUserByUserName(String username);

}
