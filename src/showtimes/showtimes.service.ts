import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { Movie } from '../movies/movie.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,

    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async createShowtime(
    createShowtimeDto: CreateShowtimeDto,
  ): Promise<Showtime> {
    const { movieId, availableSeats, showtime } = createShowtimeDto;

    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const showtimeEntity = this.showtimesRepository.create({
      showtime, // Ensure this value is provided
      availableSeats,
      movie,
    });

    return this.showtimesRepository.save(showtimeEntity);
  }

  findAll(): Promise<Showtime[]> {
    return this.showtimesRepository.find({ relations: ['movie'] });
  }

  findById(id: number): Promise<Showtime> {
    return this.showtimesRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
  }

  async updateShowtime(
    id: number,
    showtimeData: Partial<Showtime>,
  ): Promise<Showtime> {
    await this.showtimesRepository.update(id, showtimeData);
    return this.findById(id);
  }

  async deleteShowtime(id: number): Promise<void> {
    await this.showtimesRepository.delete(id);
  }
}
