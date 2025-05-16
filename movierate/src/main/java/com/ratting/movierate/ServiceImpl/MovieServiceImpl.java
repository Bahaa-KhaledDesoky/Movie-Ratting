package com.ratting.movierate.ServiceImpl;
import com.ratting.movierate.DTOs.MovieRespond;
import com.ratting.movierate.DTOs.SearchOmdbRespond;
import com.ratting.movierate.Exceptions.MovieExistFoundException;
import com.ratting.movierate.Exceptions.MovieNotFoundException;
import com.ratting.movierate.Mapping.MovieMapping;
import com.ratting.movierate.Model.Movie;
import com.ratting.movierate.Repository.MovieRepositiory;
import com.ratting.movierate.Service.MovieService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final MovieRepositiory movieRepositiory;
    private final RestTemplate restTemplate;
    private final MovieMapping movieMapping;
    @Override
    public MovieRespond getMovie(Long id) {
        Movie movie= movieRepositiory.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        return movieMapping.toMovieRespond(movie);

    }

    @Override
    public Integer getNumberOfMovies() {
        return (Integer) movieRepositiory.findAll().size();
    }

    @Override
    public List<MovieRespond> getMovieByTitleDBUsingLike(String title) {
        List<MovieRespond>result= movieRepositiory.searchByTitle(title).
                stream()
                .map(movieMapping::toMovieRespond)
                .collect(Collectors.toList());
        if (!result.isEmpty())
            return result;
        else
            throw new MovieNotFoundException("Cant find movie with this title : "+title);
    }

    @Override
    public Movie getMoviefromOmdb(String imdb_id) {
        String url = "https://www.omdbapi.com/?apikey=" + "4e4b3c4b" + "&i=" + imdb_id+"&type=movie";

        Movie result= restTemplate.getForObject(url, Movie.class);
        if(result.getResponse().equals("True"))
            return result;
        else {
            throw new MovieNotFoundException("no movie found");
        }

    }
    @Override
    public SearchOmdbRespond searchFormMovieOnOmdb(String title,Integer page) {
        String url = "https://www.omdbapi.com/?apikey=" + "4e4b3c4b" + "&s=" + title+"&type=movie"+"&page="+page;
        SearchOmdbRespond result= restTemplate.getForObject(url, SearchOmdbRespond.class);
        if(result.response().equals("True"))
            return result;
        else {
            throw new MovieNotFoundException("no movie has this name");
        }
    }

    @Override
    public List<MovieRespond> getMoviesPage(Integer page) {
        Pageable pageable = PageRequest.of(page,10);
        return movieRepositiory.findAll(pageable).stream()
                .map(movieMapping::toMovieRespond)
                .collect(Collectors.toList());
    }

    @Override
    public Long deleteMovie(Long id) {
        Movie movie =movieRepositiory.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        movieRepositiory.deleteById(id);
        return id;
    }

    @Override
    public void deleteMovies(List<Long> movieIds) {
        List<Movie> movies=movieRepositiory.findAllById(movieIds);
        for (Movie m: movies)
        {
            deleteMovie(m.getId());
        }
    }

    @Override
    public Long addMovie(Movie request) {
        if(!movieRepositiory.findByImdbID(request.getImdbID()).isPresent())
            return movieRepositiory.save(request).getId();
        else
            throw new MovieExistFoundException();
    }

    @Override
    public boolean existMovie(String title) {
        return movieRepositiory.findByTitle(title).isPresent();
    }


//    @Override
//    public Long updateMovie(Long id, MovieRequest request) {
//        if(movieRepositiory.findById(id).isPresent())
//            return movieRepositiory.save(mapping.toMovie(id,request)).getId();
//        else
//            throw new MovieNotFoundException(id);
//    }

}
