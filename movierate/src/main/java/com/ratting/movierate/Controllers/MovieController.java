package com.ratting.movierate.Controllers;

import com.ratting.movierate.DTOs.MovieRespond;
import com.ratting.movierate.Exceptions.MovieExistFoundException;
import com.ratting.movierate.Exceptions.MovieNotFoundException;
import com.ratting.movierate.Model.Movie;
import com.ratting.movierate.Model.OmdbRating;
import com.ratting.movierate.ServiceImpl.MovieServiceImpl;
import com.ratting.movierate.ServiceImpl.OmdbRatingServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/movie/")
@RequiredArgsConstructor
public class MovieController {
    private final MovieServiceImpl movieService;
    private final OmdbRatingServiceImpl omdbRatingService;

    @GetMapping("/getMoviesPage/{page}")
    public ResponseEntity<List<MovieRespond>> getMoviesPage(@PathVariable Integer page){
        var result =movieService.getMoviesPage(page);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/getNumberOfMovies")
    public Integer getNumberOfMovies(){
        var result =movieService.getNumberOfMovies();
        return result;
    }
    @GetMapping("/getMovie/{id}")
    public ResponseEntity<?> getMovie(@PathVariable Long id){
        try {
            var result =movieService.getMovie(id);
            return ResponseEntity.ok(result);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Movie with ID " + id + " not found.");
        }

    }
    @GetMapping("/getMovieByTitle/{title}")
    public ResponseEntity<?> getMovieByTitle(@PathVariable String title){
        try {
            var result =movieService.getMovieByTitleDBUsingLike(title);
            return ResponseEntity.ok(result);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("no movie has this name on DB");
        }

    }

    private Long  addMovie( Movie request){

        try {
            List<OmdbRating> omdbRating=new ArrayList<>();
            for(OmdbRating rating: request.getOmdbRatings())
            {
                omdbRating.add(rating);
            }

            request.setOmdbRatings(new ArrayList<>());
            var result =movieService.addMovie(request);
            for(OmdbRating rating: omdbRating)
            {
                rating.setMovie(request);
                omdbRatingService.addOmdbRating(rating);
            }
            return result;
        }
        catch (Exception e)
        {
            throw new MovieExistFoundException();
        }

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getMoviefromOmdb/{Imdb_id}")
    public ResponseEntity<?> getMoviefromOmdb(@PathVariable String Imdb_id){

        try {
            var result =movieService.getMoviefromOmdb(Imdb_id);
            return ResponseEntity.ok(result);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("no movie has this name on OMDB");
        }

    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/searchFormMovieOnOmdb/{title}")
    public ResponseEntity<?> searchFormMovieOnOmdb(@PathVariable String title,@RequestParam(defaultValue = "1")Integer page){

        try {
            var result =movieService.searchFormMovieOnOmdb(title,page);
            return ResponseEntity.ok(result);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("no movie has this name on OMDB");
        }

    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addMoviefromOmdb/{imdb}")
    public ResponseEntity<?> addMoviefromOmdb(@PathVariable String imdb){
        try {
            var result =movieService.getMoviefromOmdb(imdb);
            addMovie(result);
            return ResponseEntity.ok(result);
        }
        catch (MovieNotFoundException e)
        {
            return ResponseEntity.badRequest().body("no movie found");
        }
        catch (MovieExistFoundException e)
        {
            return ResponseEntity.badRequest().body("movie is already in the database");
        }

    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addMovies")
    public void addMovies(@RequestBody List<Movie>request){

        for (Movie movie:request)
        {
            if(movieService.existMovie(movie.getTitle()))
                continue;
            addMovie(movie);
        }


    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteMovie/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id)
    {
        try {
            var result =movieService.deleteMovie(id);
            return ResponseEntity.ok(result);
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Movie with ID " + id + " not found.");
        }

    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteMovies")
    public ResponseEntity<?> deleteMovies (@RequestBody List<Long> ids)
    {
        movieService.deleteMovies(ids);
        return ResponseEntity.ok().body("Movies are deleted");
    }

}
