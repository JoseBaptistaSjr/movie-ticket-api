import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('populate')
  async populateMovies() {
    await this.moviesService.populateMovies();
    return { message: 'Movies populated successfully' };
  }

  @Get()
  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get('search')
  findByTitle(@Query('title') title: string): Promise<Movie[]> {
    return this.moviesService.findByTitle(title);
  }

  @Get('filter')
  filterByGenre(@Query('genre') genre: string): Promise<Movie[]> {
    return this.moviesService.filterByGenre(genre);
  }
}
