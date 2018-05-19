import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";
import { default as Parking, ParkingModel } from "../models/Parking";
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
 * GET /bookparking
 * Book parking form page.
 */
export let getBookings = (req: Request, res: Response) => {
  const todayDate = GetTodayDate();

  Parking.find({bookDate: { $gte : todayDate }}, (err, alldata) => {
    res.render("parking", {
      title: "Book parking spot",
      content: alldata
    });
  });
};

/**
 * POST /bookparking
 * Send a bookparking to db.
 */
export let postBooking = (req: Request, res: Response, next: NextFunction) => {
  const parking = new Parking({
    bookDate: req.body.bookDate,
    userId: req.user.id
  });

  Parking.findOne({bookDate: req.body.bookDate, userId: req.user.id}, (err, existingBooking: ParkingModel) => {
    if (err) { return next(err); }
    if (existingBooking) {
      Parking.findOneAndRemove({bookDate: req.body.bookDate, userId: req.user.id}, (err2, res: ParkingModel) => {
        if (err2) {
          return next(err2);
        }
      });
      return res.redirect("/bookparking");
    }
    parking.save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/bookparking");
    });
  });
};
