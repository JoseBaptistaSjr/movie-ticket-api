import {
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Endpoint to populate movies from the TMDb API
  @Post('populate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async populateMovies(): Promise<void> {
    await this.moviesService.populate();
  }

  // Get all movies
  @Get()
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  // Get a movie by ID
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.findById(id);
  }
}
