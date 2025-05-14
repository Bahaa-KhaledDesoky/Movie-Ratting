package com.ratting.movierate.ServiceImpl;

import com.ratting.movierate.Model.OmdbRating;
import com.ratting.movierate.Repository.OmdbRatingRepository;
import com.ratting.movierate.Service.OmdbRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OmdbRatingServiceImpl implements OmdbRatingService {

    private final OmdbRatingRepository omdbRatingRepository;
    @Override
    public long addOmdbRating(OmdbRating rating) {
        return omdbRatingRepository.save(rating).getId();
    }
}
