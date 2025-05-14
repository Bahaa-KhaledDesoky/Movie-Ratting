package com.ratting.movierate.Repository;

import com.ratting.movierate.Model.Movie;
import com.ratting.movierate.Model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RattingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);
    List<Rating> findAllByMovieId(Long movieId);
}
