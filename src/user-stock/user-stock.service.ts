import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserStockDocument, UserStock } from './schemas/user-stock.schema';
import { Model } from 'mongoose';
import { Stats, Stock } from './interface';
import axios from 'axios';

@Injectable()
export class UserStockService {
  @InjectModel(UserStock.name) private userStockModel: Model<UserStockDocument>;

  async findStock(query: string, username: string): Promise<UserStock> {
    try {
      const stock: UserStock = await axios
        .get(String(process.env.INTERNAL_STOCK_API_URL + query))
        .then(({ data }) => data);
      await this.addDataToQueryHistory(stock, username);

      return stock;
    } catch (error) {
      throw new HttpException(
        'Something Went Wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async addDataToQueryHistory(
    stock: UserStock,
    username: string,
  ): Promise<UserStock> {
    const createdStockQuery = new this.userStockModel(stock);
    createdStockQuery.username = username;

    return await createdStockQuery.save();
  }

  public async findUserStockQueryHistory(username: string): Promise<Stock[]> {
    try {
      const stockDocumentArray = await this.userStockModel
        .find({ username: username })
        .exec();

      return stockDocumentArray.map((stockDocument) =>
        this.convertToStock(stockDocument),
      );
    } catch (error) {
      throw new HttpException(
        'Something Went Wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private convertToStock(userStockDocument: UserStockDocument): Stock {
    const { Close, Date, Symbol, High, Low, Name, Open, Time, Volume } =
      userStockDocument;

    return {
      Close,
      Date,
      Symbol,
      High,
      Low,
      Name,
      Open,
      Time,
      Volume,
    };
  }

  public async findMostRequestedQueries(): Promise<Stats[]> {
    return await this.userStockModel.aggregate([
      { $group: { _id: '$Symbol', requested_times: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          stock: '$_id',
          requested_times: 1,
          sum: 1,
        },
      },
    ]);
  }
}
