export interface OmdbRating {
  source?: string;
  value?: string;
  Source?: string;
  Value?: string;
}

export interface Rating {
  id: number;
  user_name: string;
  movie_id: number;
  rate: number;
}

export interface Movie {
  id?: number;
  title: string;
  year?: string;
  rated?: string;
  released?: string;
  runtime?: string;
  genre?: string;
  director?: string;
  writer?: string;
  actors?: string;
  plot?: string;
  language?: string;
  country?: string;
  awards?: string;
  poster?: string;
  omdbRatings?: OmdbRating[];
  ratings?: Rating[];
  metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  type?: string;
  dvd?: string;
  boxOffice?: string;
  production?: string;
  website?: string;
  response?: string;
  selected?: boolean;
} 