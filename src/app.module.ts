import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { Movie } from './movies/movie.entity';
import { ConfigModule } from '@nestjs/config';
import { Showtime } from './showtimes/showtime.entity';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { Ticket } from './tickets/ticket.entity';
import { TicketsModule } from './tickets/tickets.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Movie, Showtime, Ticket],
      synchronize: true,
    }),
    MoviesModule,
    ShowtimesModule,
    TicketsModule,
  ],
})
export class AppModule {}
