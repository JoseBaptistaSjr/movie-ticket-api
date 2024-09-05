import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './ticket.entity';
import { Showtime } from '../showtimes/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Showtime])],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
