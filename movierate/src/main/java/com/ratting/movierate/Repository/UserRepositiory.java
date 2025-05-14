package com.ratting.movierate.Repository;


import com.ratting.movierate.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepositiory extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
