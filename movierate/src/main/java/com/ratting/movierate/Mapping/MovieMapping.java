package com.ratting.movierate.Mapping;

import com.ratting.movierate.DTOs.MovieRespond;
import com.ratting.movierate.Model.Movie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MovieMapping {
    private final RattingMapping rattingMapping;
    public MovieRespond toMovieRespond(Movie movie) {
        return new MovieRespond(
                movie.getId(),
                movie.getTitle(),
                movie.getYear(),
                movie.getRated(),
                movie.getReleased(),
                movie.getRuntime(),
                movie.getGenre(),
                movie.getDirector(),
                movie.getWriter(),
                movie.getActors(),
                movie.getPlot(),
                movie.getLanguage(),
                movie.getCountry(),
                movie.getAwards(),
                movie.getPoster(),
                movie.getOmdbRatings(),
                movie.getRatings().stream()
                        .map(rattingMapping::toRattingRespons)
                        .collect(Collectors.toList()),
                movie.getMetascore(),
                movie.getImdbRating(),
                movie.getImdbVotes(),
                movie.getImdbID(),
                movie.getType(),
                movie.getDvd(),
                movie.getBoxOffice(),
                movie.getProduction(),
                movie.getWebsite(),
                movie.getResponse()
        );
    }

}
