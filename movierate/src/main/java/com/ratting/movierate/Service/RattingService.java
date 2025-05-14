package com.ratting.movierate.Service;

import com.ratting.movierate.DTOs.AddRattingRequest;
import jakarta.servlet.http.HttpServletRequest;


public interface RattingService {
    public Long addRate(AddRattingRequest request, HttpServletRequest http);

}
