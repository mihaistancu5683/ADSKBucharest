export enum BookingStatus {
    Available,
    Booked,
    Full
}
export class Day {
  internalDate: Date; // e.g.: 2018-09-24 21:00:00.000Z
  userDate: string; // e.g.: Thu 26/9/2018
}
export class RespItem {
  internalDate: Date;
  userDate: string;
  status: BookingStatus;
  usersExploded: string;
}

export default {
  BookingStatus,
  Day,
  RespItem
};