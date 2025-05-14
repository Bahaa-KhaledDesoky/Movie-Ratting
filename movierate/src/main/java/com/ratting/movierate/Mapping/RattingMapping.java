package com.ratting.movierate.Mapping;

import com.ratting.movierate.DTOs.AddRattingRequest;
import com.ratting.movierate.DTOs.RattingRespons;
import com.ratting.movierate.Exceptions.MovieNotFoundException;
import com.ratting.movierate.Model.Movie;
import com.ratting.movierate.Model.Rating;
import com.ratting.movierate.Repository.MovieRepositiory;
import com.ratting.movierate.Model.User;
import com.ratting.movierate.Repository.UserRepositiory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class RattingMapping {
    private final UserRepositiory userRepositiory;
    private final MovieRepositiory movieRepositiory;
   public Rating toRatting(AddRattingRequest request, User user)
   {

       Movie movie = movieRepositiory.findById(request.movie())
               .orElseThrow(() -> new MovieNotFoundException(request.movie()));

       return Rating.builder()
               .user(user)
               .movie(movie)
               .rate(request.rate())
               .build();
   }
   public RattingRespons toRattingRespons(Rating request)
   {
       return new RattingRespons(
               request.getId(),
               request.getUser().getUsername(),
               request.getMovie().getId(),
               request.getRate()
       );
   }
}
