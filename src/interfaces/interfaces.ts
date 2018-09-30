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