package com.ratting.movierate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MovierateApplication {

	public static void main(String[] args) {
		SpringApplication.run(MovierateApplication.class, args);
	}

}
