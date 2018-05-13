import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";
import { default as Parking, ParkingModel } from "../models/Parking";
import { WriteError } from "mongodb";

/**
 * GET /bookparking
 * Book parking form page.
 */
export let getBookings = (req: Request, res: Response) => {
  // if (req.user) {
  //   return res.redirect("/");
  // }

  Parking.find({}, (err, alldata) => {
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
    userId: req.body.userId
  });

  Parking.findOne({bookDate: req.body.bookDate, userId: req.body.userId}, (err, existingBooking: ParkingModel) => {
    if (err) { return next(err); }
    if (existingBooking) {
      req.flash("errors", { msg: "Booking on that date already exists." });
      return res.redirect("/signup");
    }
    parking.save((err) => {
      if (err) { return next(err); }
      req.logIn(parking, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  });
};
