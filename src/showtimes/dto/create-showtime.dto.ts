import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsString()
  showtime: string;

  @IsNotEmpty()
  @IsNumber()
  availableSeats: number;

  @IsNotEmpty()
  @IsNumber()
  movieId: number;
}
