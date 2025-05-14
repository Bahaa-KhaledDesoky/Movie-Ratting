package com.ratting.movierate.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record AddRattingRequest(

        Long movie,
        @Max(value = 10,message = "ratting must be between 10 and 0")
        @Min(value=0,message = "ratting must be between 10 and 0")
        Integer rate
) {
}
