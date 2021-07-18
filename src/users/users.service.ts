import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { CreatedUser } from './interfaces/created-user.interface';
import { IUser } from './interfaces/user.interface';
import { UserProfile } from './profile.enum';
import { User, UserDocument } from './schemas/user.schema';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  async create(user: User): Promise<CreatedUser> {
    try {
      const createdUser = new this.userModel(user);
      createdUser.password = randomUUID();
      createdUser.profile =
        user.profile === UserProfile.SUPER_USER
          ? UserProfile.SUPER_USER
          : UserProfile.NORMAL_USER;

      const { username, password } = await createdUser.save();
      return { username, password };
    } catch (error) {
      throw new HttpException(
        'There is already a register of this username: ' + user.username,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().exec();

    return users.map((user) => this.convertToIUser(user));
  }

  async findOne(username: string): Promise<User> {
    try {
      return await this.userModel.findOne({ username: username }).exec();
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  private convertToIUser(user: UserDocument): IUser {
    const { name, username, profile } = user;

    return {
      name,
      username,
      profile,
    };
  }

  async removeUser(id: string): Promise<string> {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id }).exec();

    if (!deletedCount) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      return JSON.stringify({
        statusCode: HttpStatus.OK,
        message: 'User has been deleted succesfully',
      });
    }
  }

  async resetPassword(username: string): Promise<void> {
    const newPassword = randomUUID();
    try {
      await this.userModel.updateOne(
        { username },
        { password: newPassword },
        { new: false },
      );
    } catch (error) {
      console.log(error);
    }

    console.log(process.env.EMAIL);

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      domain: process.env.NODEMAILER_DOMAIN,
      secure: process.env.NODEMAILER_SECURE,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_EMAIL_PASS,
      },
      logger: true,
      transactionLog: true,
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: username,
      subject: 'Jobsity - Node Challenge',
      text: 'Your new password is: ' + newPassword,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
