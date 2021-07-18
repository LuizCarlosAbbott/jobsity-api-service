import { Module } from '@nestjs/common';
import { UserStockService } from './user-stock.service';
import { UserStockController } from './user-stock.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserStock, UserStockSchema } from './schemas/user-stock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserStock.name, schema: UserStockSchema },
    ]),
  ],
  controllers: [UserStockController],
  providers: [UserStockService],
})
export class UserStockModule {}
