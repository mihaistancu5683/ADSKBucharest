import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";
import { default as BookDate, BookingDateModel } from "../models/BookDate";
import { WriteError } from "mongodb";

function GetTodayDate(): string {
  const today = new Date();
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

  return dd + "/" + mm + "/" + yyyy.toString();
}

/**
 * GET /bookdate
 * Book parking form page.
 */
export let getBookings = (req: Request, res: Response) => {
  const todayDate = GetTodayDate();

  BookDate.find({bookDate: { $gte : todayDate }}, (err, alldata) => {
    res.render("parking", {
      title: "Book parking spot",
      content: alldata
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
          if (userFound) { // User is on the booking list, delete the booking
            delete existingBookDate.users[index];
          }
          else { // User is not on the booking list, book the date
            existingBookDate.users.push(req.user.id);
          }
          BookDate.updateOne({bookDate: req.body.bookDate}, {bookDate: req.body.bookDate, users: existingBookDate.users} , (err3, resp: BookingDateModel) => {
            if (err3) { return next(err3); }
          });
        }
        return res.redirect("/bookdate");
    });
  };
