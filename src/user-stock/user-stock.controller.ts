import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserStockService } from './user-stock.service';

@Controller()
export class UserStockController {
  constructor(private readonly userStockService: UserStockService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stock')
  findStock(@Query('q') query: string, @Request() request) {
    const { user } = request;
    return this.userStockService.findStock(query, user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  findUserStockQueryHistory(@Request() request) {
    const { user } = request;
    return this.userStockService.findUserStockQueryHistory(user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  findMostRequestedQueries(@Request() request) {
    const { user } = request;

    if (user.profile === 1) {
      return this.userStockService.findMostRequestedQueries();
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
