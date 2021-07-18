import { Test, TestingModule } from '@nestjs/testing';
import { UserStockController } from './user-stock.controller';
import { UserStockService } from './user-stock.service';

describe('UserStockController', () => {
  let controller: UserStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStockController],
      providers: [UserStockService],
    }).compile();

    controller = module.get<UserStockController>(UserStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
