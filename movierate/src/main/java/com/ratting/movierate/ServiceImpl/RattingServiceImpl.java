package com.ratting.movierate.ServiceImpl;

import com.ratting.movierate.DTOs.AddRattingRequest;
import com.ratting.movierate.Exceptions.RattingExistException;
import com.ratting.movierate.Mapping.RattingMapping;
import com.ratting.movierate.Model.User;
import com.ratting.movierate.Repository.RattingRepository;
import com.ratting.movierate.Security.JwtUtils;
import com.ratting.movierate.Service.RattingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RattingServiceImpl implements RattingService {
    private final RattingRepository ratingRepository;
    private final JwtUtils jwtUtil;
    private final RattingMapping mapping;
    @Override
    public Long addRate(AddRattingRequest request, HttpServletRequest http) {

         User user=jwtUtil.getUserfromRequest(http);
        if(!ratingRepository.findByUserIdAndMovieId(user.getId(), request.movie()).isPresent())
        {
            return ratingRepository.save(mapping.toRatting(request,user)).getId();
        }
        else
            throw new RattingExistException();
    }

}
