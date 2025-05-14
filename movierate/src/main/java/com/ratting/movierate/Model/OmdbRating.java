package com.ratting.movierate.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class OmdbRating {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "movie_id", nullable = false)
        @JsonIgnore
        private Movie movie;
        @JsonProperty("Source")
        private String Source;
        @JsonProperty("Value")
        private String Value;


}
