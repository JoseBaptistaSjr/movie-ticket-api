import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import axios from 'axios';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async populateMovies() {
    const apiKey = '1862f94d979ce1e7220a6431119737a9';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

    const response = await axios.get(url);
    const movies = response.data.results;

    for (const movieData of movies) {
      const movie = new Movie();
      movie.title = movieData.title;
      movie.description = movieData.overview;
      movie.releaseDate = movieData.release_date;
      movie.genre = movieData.genre_ids.join(', '); // You might want to map genre IDs to actual genre names
      movie.posterPath = movieData.poster_path;

      await this.moviesRepository.save(movie);
    }
  }

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  findByTitle(title: string): Promise<Movie[]> {
    return this.moviesRepository.find({ where: { title } });
  }

  filterByGenre(genre: string): Promise<Movie[]> {
    return this.moviesRepository.find({ where: { genre } });
  }
}
