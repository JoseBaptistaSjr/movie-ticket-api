import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showtime: string; // Ensure this is always provided

  @Column()
  availableSeats: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { nullable: false })
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];
}
