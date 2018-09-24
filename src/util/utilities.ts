import { Day } from "./classes";
import { Request, Response, NextFunction } from "express";
import { BookingFPModel } from "../models/BookFP";
import { ConfigModel } from "../models/Config";
import { BookingStatus, RespItem } from "./classes";
import { default as Db } from "../util/db";
import { resolve } from "dns";

const Utilities = (function () {
  const weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

  const GetSimpleDateFromToday = function (addDays: number): Day {
    const today = new Date(new Date().getTime() + addDays * 24 * 60 * 60 * 1000);
    const idx = today.getDay();
    const dd_tmp = today.getDate();
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

  const ProcessFPDayByDay = function(req: Request, config: ConfigModel, bookingsStartingToday: BookingFPModel[]): Promise<RespItem[]> {
    return new Promise<RespItem[]> ((resolve, reject) => {
      const response: RespItem[] = [];
      const nextWeek: Day[] = [];
      for (let i = 0; i <= 6; i++) {
        const day = Utilities.GetSimpleDateFromToday(i);
        nextWeek.push(day);
      }

      nextWeek.forEach(day => {
        let daystatus: BookingStatus = BookingStatus.Available;
        let usersExploded: string = "";
        bookingsStartingToday.forEach(booking => {
          if (day.date === booking.bookDate) {
            if (booking.users.length >= config.parkingSpotsNoFP) {
              daystatus = BookingStatus.Full;
            }
            if (-1 !== booking.users.indexOf(req.user.emailId)) {
              daystatus = BookingStatus.Booked;
            }
            booking.users.forEach(userMail => {
              usersExploded += userMail + "\n";
            });
          }
        });
        const item: RespItem = {
          fulldate: day.name + " " + day.date,
          date: day.date,
          status: daystatus,
          usersExploded: usersExploded
        };
        response.push(item);
      });
      resolve(response);
    });
  };

  const CreateFPResponse = function (req: Request, bookingsStartingToday: BookingFPModel[]): Promise<RespItem[]> {
    return new Promise<RespItem[]> ((resolve, reject) => {
      Db.GetConfig().then(config => {
        return Utilities.ProcessFPDayByDay(req, config, bookingsStartingToday);
      }).then(response => {
        resolve(response);
      });
    });
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

  const ProcessFPRequest = async function (req: Request, res: Response, next: NextFunction, existingFPBook: BookingFPModel): Promise<void> {
    const config = await Db.GetConfig();
    {
      if (!existingFPBook) {
        Db.SaveBookFPDate(req.body.bookDate, req.user.emailId);
      }
      else {
        const userFound = Utilities.IsCurrentUserInFPBookingArray(req.user.emailId, existingFPBook);
        if (userFound) {
          const updatedUsersArray = existingFPBook.users.filter(user => { return user !== req.user.emailId; });
          Db.UpdateBookFP(req.body.bookDate, updatedUsersArray);
        }
        else {
          if (existingFPBook.users.length <= config.parkingSpotsNoFP - 1) {
            existingFPBook.users.push(req.user.emailId);
            Db.UpdateBookFP(req.body.bookDate, existingFPBook.users);
          }
          else {
            return next("Booking list already full for selected day");
          }
        }
      }
      return res.redirect("/bookfp");
    }
  };

  return {
    GetSimpleDateFromToday: GetSimpleDateFromToday,
    CreateFPResponse: CreateFPResponse,
    IsCurrentUserInFPBookingArray: IsCurrentUserInFPBookingArray,
    ProcessFPRequest: ProcessFPRequest,
    ProcessFPDayByDay: ProcessFPDayByDay
  };
})();
export default Utilities;