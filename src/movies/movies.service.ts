import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3';
  private readonly TMDB_API_KEY: string;

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private configService: ConfigService,
  ) {
    this.TMDB_API_KEY = this.configService.get<string>('TMDB_API_KEY');
  }

  // Populate movies from TMDb API and store them in the database
  async populate(): Promise<void> {
    try {
      const response = await axios.get(`${this.TMDB_API_URL}/movie/popular`, {
        params: {
          api_key: this.TMDB_API_KEY,
        },
      });

      const movies = response.data.results;

      for (const movieData of movies) {
        const movie = new Movie();
        movie.title = movieData.title;
        movie.description = movieData.overview;
        movie.releaseDate = movieData.release_date;
        movie.genre = movieData.genre_ids?.join(', ') || '';
        movie.posterPath = movieData.poster_path;

        await this.moviesRepository.save(movie);
      }
    } catch (error) {
      console.error('Error populating movies:', error);
      throw new Error('Failed to fetch and populate movies');
    }
  }

  // Find all movies
  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({ relations: ['showtimes'] });
  }

  // Find a movie by ID
  async findById(id: number): Promise<Movie> {
    return this.moviesRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });
  }
}
