import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime } from './showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  async create(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<Showtime> {
    return this.showtimesService.createShowtime(createShowtimeDto);
  }

  @Get()
  async findAll(): Promise<Showtime[]> {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Showtime> {
    const showtime = await this.showtimesService.findById(id);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    return showtime;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateShowtimeDto: Partial<Showtime>,
  ): Promise<Showtime> {
    return this.showtimesService.updateShowtime(id, updateShowtimeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.showtimesService.deleteShowtime(id);
  }
}
