import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";
import { default as BookDate, BookingDateModel } from "../models/BookDate";
import { WriteError } from "mongodb";

const parkingSpotsNo = 5;

function GetTodayDate(addDays: number): string {
  const today = new Date(new Date().getTime() + addDays * 24 * 60 * 60 * 1000);
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

  return dd + "/" + mm + "/" + yyyy.toString();
}

/**
 * GET /bookdate
 * Book parking form page.
 */export let getBookings = (req: Request, res: Response) => {
  const nextWeek: string[] = [];

  for (let i = 0; i <= 6; i++) {
    const day = GetTodayDate(i);
    nextWeek.push(day);
  }

  const todayDate = GetTodayDate(0);
  BookDate.find({bookDate: { $gte : todayDate }}, (err, allDates: BookingDateModel[]) => {
    class RespItem {
      alreadyBooked: boolean;
      available: boolean;
      date: string;
    }
    const response: RespItem[] = [];

    nextWeek.forEach(day => {
      let availableDay: boolean = true;
      let booked: boolean = false;
      allDates.forEach(date => {
        if (day === date.bookDate) {
          if (date.users.length >= parkingSpotsNo) {
            availableDay = false;
          }
          if (-1 !== date.users.indexOf(req.user.id)) {
            booked = true;
            availableDay = true; // should be able to delete booking
          }
        }
      });
      const item: RespItem = {
        date: day,
        available: availableDay,
        alreadyBooked: booked
      };
      response.push(item);
    });
    res.render("bookDate", {
      title: "Book parking spot",
      content: response
    });
  });
};

/**
 * POST /bookdate
 * Send a bookdate to db.
 */
export let postBooking = (req: Request, res: Response, next: NextFunction) => {
  const newBooking = new BookDate({
    bookDate: req.body.bookDate,
    users: [req.user.id]
  });
    BookDate.findOne({bookDate: req.body.bookDate}, (err, existingBookDate: BookingDateModel) => {
      if (err) { return next(err); }
      if (!existingBookDate) {
        // Date not found, add date and user
           newBooking.save((err2) => {
             if (err2) { return next(err2); }
           });
        }
        else { // Date found, check if current user is on the booking list
          let userFound: boolean = false;
          let index: number = -1;
          existingBookDate.users.forEach(user => {
            if (user === req.user.id) {
              userFound = true;
            }
            index++;
          });
          if (userFound) { // User is on the booking list, replace the users array with another that doesn't contain the user
            const filteredUsers = existingBookDate.users.filter(user => {return user !== req.user.id; });
            BookDate.updateOne({bookDate: req.body.bookDate}, {bookDate: req.body.bookDate, users: filteredUsers} , (err3, resp1: BookingDateModel) => {
              if (err3) { return next(err3); }
            });
          }
          else { // User is not on the booking list, add user to users array (book date)
            existingBookDate.users.push(req.user.id);
            if (existingBookDate.users.length <= parkingSpotsNo) {
              BookDate.updateOne({bookDate: req.body.bookDate}, {bookDate: req.body.bookDate, users: existingBookDate.users} , (err4, resp2: BookingDateModel) => {
                if (err4) { return next(err4); }
              });
            }
            else {
              return next("Booking list already full for selected day");
            }
          }
        }
        return res.redirect("/bookdate");
    });
  };
