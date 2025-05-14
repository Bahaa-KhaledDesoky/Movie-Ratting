package com.ratting.movierate.DTOs;

import com.ratting.movierate.Model.OmdbRating;

import java.util.List;

public record MovieRespond(
        
     Long id,
    
     String title,

     String year,

     String rated,

     String released,

     String runtime,

     String genre,

     String director,

     String writer,

     String actors,

     String plot,

     String language,

     String country,

     String awards,

     String poster,

     List<OmdbRating> omdbRatings,

     List<RattingRespons> ratings,

     String metascore,

    
     String imdbRating,

    
     String imdbVotes,

    
     String imdbID,

    
     String type,

    
     String dvd,

    
     String boxOffice,

     String production,

     String website,

     String response


) {
}
