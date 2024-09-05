import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('purchase/:showtimeId')
  async purchaseTicket(
    @Param('showtimeId') showtimeId: number,
    @Body() body: { customerName: string; numberOfTickets: number },
  ): Promise<Ticket[]> {
    const { customerName, numberOfTickets } = body;
    return this.ticketsService.purchaseTicket(
      showtimeId,
      customerName,
      numberOfTickets,
    );
  }

  @Get('showtime/:showtimeId')
  async getAllTicketsForShowtime(
    @Param('showtimeId') showtimeId: number,
  ): Promise<Ticket[]> {
    return this.ticketsService.getAllTicketsForShowtime(showtimeId);
  }

  @Get(':id')
  async getTicketById(@Param('id') id: number): Promise<Ticket> {
    return this.ticketsService.getTicketById(id);
  }
}
