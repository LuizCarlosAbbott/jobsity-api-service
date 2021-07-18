import { Test, TestingModule } from '@nestjs/testing';
import { UserStockService } from './user-stock.service';

describe('UserStockService', () => {
  let service: UserStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStockService],
    }).compile();

    service = module.get<UserStockService>(UserStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
