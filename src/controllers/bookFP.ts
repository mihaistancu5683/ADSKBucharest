import { Request, Response, NextFunction } from "express";
import { default as Utilities } from "../util/utilities";
import { default as Db } from "../util/db";

/**
 * GET /bookfp
 * Book parking form page.
 */export let getBookings = (req: Request, res: Response) => {
    const todayDate = Utilities.GetSimpleDateFromToday(0);

    Db.GetFPBookingsStartingToday(todayDate)
      .then(bookingsStartingToday => Utilities.CreateFPResponse(req, bookingsStartingToday))
      .then(FPresponse => {
        res.render("bookFP", {
          title: "Book fast parking spot",
          content: FPresponse
        });
      });
  };

/**
 * POST /bookdate
 * Send a bookdate to db.
 */
export let postBooking = (req: Request, res: Response, next: NextFunction) => {
  Db.CheckIfDateIsBooked(req.body.bookDate)
    .then(existingFPBook => Utilities.ProcessFPRequest(req, res, next, existingFPBook));
};
