package com.ratting.movierate.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ratting.movierate.Model.Movie;
import com.ratting.movierate.Model.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public record RattingRespons(
         Long id,
         String user_name,
         Long movie_id,
         Integer rate
) {
}
