import { Day } from "./classes";
import { Request } from "express";
import { BookingFPModel } from "../models/BookFP";
import { BookingStatus, RespItem } from "./classes";

const Utilities = (function() {
  const weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

  const GetSimpleDateFromToday = function (addDays: number): Day {
    const today = new Date(new Date().getTime() + addDays * 24 * 60 * 60 * 1000);
    const idx = today.getDay();
    const dd_tmp = today.getDate() ;
    const mm_tmp = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let dd, mm: string;

    if (dd_tmp < 10) {
      dd = "0" + dd_tmp.toString();
    }
    else {
      dd = dd_tmp.toString();
    }
    if (mm_tmp < 10) {
      mm = "0" + mm_tmp.toString();
    }
    else {
      mm = mm_tmp.toString();
    }
    const day = new Day();
    day.date = dd + "/" + mm + "/" + yyyy.toString();
    day.name = weekday[idx];
    return day;
  };

  const CreateFPResponse = function (req: Request, bookingsStartingToday: BookingFPModel[], parkingSpotsNo: number): RespItem[] {
    const response: RespItem[] = [];

    const nextWeek: Day[] = [];
    for (let i = 0; i <= 6; i++) {
      const day = Utilities.GetSimpleDateFromToday(i);
      nextWeek.push(day);
    }

    nextWeek.forEach(day => {
      let daystatus: BookingStatus = BookingStatus.Available;
      bookingsStartingToday.forEach(booking => {
        if (day.date === booking.bookDate) {
          if (booking.users.length >= parkingSpotsNo) {
            daystatus = BookingStatus.Full;
          }
          if (-1 !== booking.users.indexOf(req.user.emailId)) {
            daystatus = BookingStatus.Booked;
          }
        }
      });
      const item: RespItem = {
        fulldate: day.name + " " + day.date,
        date: day.date,
        status: daystatus
      };
      response.push(item);
    });

    return response;
  };

  const IsCurrentUserInFPBookingArray = function (emailId: string, existingFPBook: BookingFPModel): boolean {
    let userFound: boolean = false;
    existingFPBook.users.forEach(mail => {
      if (mail === emailId) {
        userFound = true;
      }
    });
    return userFound;
  };

  return {
      GetSimpleDateFromToday: GetSimpleDateFromToday,
      CreateFPResponse: CreateFPResponse,
      IsCurrentUserInFPBookingArray: IsCurrentUserInFPBookingArray
  };
})();
export default Utilities;