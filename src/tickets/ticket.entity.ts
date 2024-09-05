import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  seatNumber: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets, {
    nullable: false,
  })
  showtime: Showtime;
}
