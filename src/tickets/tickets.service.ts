import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Connection } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Showtime } from '../showtimes/showtime.entity';
import { Queue } from 'queue-typescript';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name); // Initialize logger
  private purchaseQueue = new Queue<{
    showtimeId: number;
    customerName: string;
    numberOfTickets: number;
    resolve: (value: Ticket[] | PromiseLike<Ticket[]>) => void;
    reject: (reason?: any) => void;
  }>();

  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,

    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,

    private connection: Connection, // Inject the connection to manage transactions
  ) {
    this.processQueue();
  }

  async purchaseTicket(
    showtimeId: number,
    customerName: string,
    numberOfTickets: number,
  ): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      this.purchaseQueue.enqueue({
        showtimeId,
        customerName,
        numberOfTickets,
        resolve,
        reject,
      });
    });
  }

  private async processQueue() {
    while (true) {
      const request = this.purchaseQueue.dequeue();

      if (!request) {
        await this.sleep(100); // Prevent CPU overload when the queue is empty
        continue;
      }

      const { showtimeId, customerName, numberOfTickets, resolve, reject } =
        request;

      try {
        // Use transaction to handle ticket purchase
        const tickets = await this.connection.transaction(
          async (transactionalEntityManager: EntityManager) => {
            // Fetch the showtime with pessimistic lock
            const showtime = await transactionalEntityManager
              .createQueryBuilder(Showtime, 'showtime')
              .where('showtime.id = :id', { id: showtimeId })
              .setLock('pessimistic_write')
              .getOne();

            if (!showtime) {
              this.logger.error(`Showtime with ID ${showtimeId} not found`);
              throw new NotFoundException(
                `Showtime with ID ${showtimeId} not found`,
              );
            }

            if (showtime.availableSeats < numberOfTickets) {
              this.logger.error(
                `Not enough available seats for showtime ${showtimeId}. Requested: ${numberOfTickets}, Available: ${showtime.availableSeats}`,
              );
              throw new ConflictException('Not enough available seats');
            }

            showtime.availableSeats -= numberOfTickets;
            await transactionalEntityManager.save(showtime);

            const createdTickets: Ticket[] = [];
            for (let i = 0; i < numberOfTickets; i++) {
              const ticket = this.ticketsRepository.create({
                customerName,
                seatNumber: `Seat ${showtime.tickets ? showtime.tickets.length + i + 1 : i + 1}`,
                showtime,
              });
              createdTickets.push(
                await transactionalEntityManager.save(ticket),
              );
            }

            return createdTickets;
          },
        );

        this.logger.log(
          `Successfully purchased ${numberOfTickets} tickets for showtime ${showtimeId} by ${customerName}`,
        );
        resolve(tickets);
      } catch (error) {
        this.logger.error(
          `Ticket purchase failed: ${error.message}`,
          error.stack,
        );
        reject(error);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllTicketsForShowtime(showtimeId: number): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { showtime: { id: showtimeId } },
    });
  }

  async getTicketById(ticketId: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: ['showtime'], // Include showtime relation if needed
    });

    if (!ticket) {
      this.logger.error(`Ticket with ID ${ticketId} not found`);
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    return ticket;
  }
}
