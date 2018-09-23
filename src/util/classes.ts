export enum BookingStatus {
    Available,
    Booked,
    Full
}
export class Day {
  date: string; // e.g.: 01/01/1970
  name: string; // e.g.: Thu
}
export class RespItem {
  date: string;
  fulldate: string;
  status: BookingStatus;
}

export default {
  BookingStatus,
  Day,
  RespItem
};