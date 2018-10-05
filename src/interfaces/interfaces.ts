import Day from "../classes/day";
import { BookingFPModel } from "../models/BookFP";
import { ConfigModel } from "../models/Config";

export enum BookingFPStatus {
    Available,
    Booked,
    Full
}

export enum BookingPPStatus {
  BookedByOwner,
  Available,
  BookedByOther
}

export interface BookFPRespItem {
  internalDate: Date; // e.g.: 2018-09-24 21:00:00.000Z
  userDate: string; // e.g.: Thu 26/9/2018
  status: BookingFPStatus;
  usersExploded: string;
}

export interface BookPPRespItem {
  internalDate: Date;
  userDate: string;
  status: BookingPPStatus;
  spot: number;
  user: string;
}

export default {
  BookingFPStatus,
  BookingPPStatus,
};

export interface IRepository {
  GetFPBookingsStartingToday(todayDate: Day): Promise<BookingFPModel[]>;
  CheckIfDateIsBooked(bookDate: Day): Promise<BookingFPModel>;
  SaveBookFPDate(bookDate: Day, emailId: string): Promise<any>;
  UpdateBookFP(bookDate: Day, users: string[]): Promise<any>;
  GetConfig(): Promise<ConfigModel>;
}