package com.ratting.movierate.Controllers;

import com.ratting.movierate.DTOs.AddRattingRequest;
import com.ratting.movierate.ServiceImpl.RattingServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/ratting/")
@RequiredArgsConstructor
public class RattingController {
    private final RattingServiceImpl rattingService;

    @PostMapping("/addRate")
    public ResponseEntity<?> addRate(@RequestBody AddRattingRequest request, HttpServletRequest http)
    {
        try {
            var result= rattingService.addRate(request,http);
            return ResponseEntity.ok(result);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("You already rated this movie");
        }
    }


}
