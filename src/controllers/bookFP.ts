import { Request, Response, NextFunction } from "express";
import { default as Utilities } from "../util/Utilities";
import { default as Db } from "../util/db";
const parkingSpotsNo = 5;

/**
 * GET /bookfp
 * Book parking form page.
 */export let getBookings = (req: Request, res: Response) => {
    const todayDate = Utilities.GetSimpleDateFromToday(0);
    Db.GetFPBookingsStartingToday(todayDate)
      .then(bookingsStartingToday => Utilities.CreateFPResponse(req, bookingsStartingToday, parkingSpotsNo))
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
    .then(existingFPBook => {
      if (!existingFPBook) {
        Db.SaveBookFPDate(req.body.bookDate, req.user.userId);
      }
      else {
        const userFound = Utilities.IsCurrentUserInFPBookingArray(req.user.userId, existingFPBook);
        if (userFound) {
          const updatedUsersArray = existingFPBook.users.filter(user => {return user !== req.user.userId; });
          Db.UpdateBookFP(req.body.bookDate, updatedUsersArray);
        }
        else {
          if (existingFPBook.users.length <= parkingSpotsNo - 1) {
            existingFPBook.users.push(req.user.userId);
            Db.UpdateBookFP(req.body.bookDate, existingFPBook.users);
          }
          else {
            return next("Booking list already full for selected day");
          }
        }
      }
      return res.redirect("/bookfp");
    });
};
