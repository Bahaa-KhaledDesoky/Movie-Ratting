package com.ratting.movierate.Repository;

import com.ratting.movierate.Model.Movie;
import com.ratting.movierate.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepositiory extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);
    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Movie> searchByTitle(@Param("title") String title);
}

