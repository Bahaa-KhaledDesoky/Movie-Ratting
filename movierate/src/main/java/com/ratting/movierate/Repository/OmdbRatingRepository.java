package com.ratting.movierate.Repository;

import com.ratting.movierate.Model.OmdbRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OmdbRatingRepository extends JpaRepository<OmdbRating, Long> {

}
