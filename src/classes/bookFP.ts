import { default as IFPRepo } from "./repository";
import { default as Utilities } from "../util/utilities";
import { Request, Response, NextFunction } from "express";
import { BookingFPModel } from "../models/BookFP";
import { BookingFPStatus, BookFPRespItem } from "../interfaces/interfaces";
import { ConfigModel } from "../models/Config";
import Day from "../classes/day";
class BookFPController {
    private repo: IFPRepo;
    constructor(repo: IFPRepo) {
        this.repo = repo;
    }
    private CreateFPResponse = function (req: Request, bookingsStartingToday: BookingFPModel[]): Promise<BookFPRespItem[]> {
        return new Promise<BookFPRespItem[]>((resolve, reject) => {
            this.repo.GetConfig()
                .then((config: ConfigModel) => {
                    return this.ProcessFPDayByDay(req, config, bookingsStartingToday);
                }).then((response: BookFPRespItem[]) => {
                    resolve(response);
                });
        });
    };

    private IsCurrentUserInFPBookingArray = function (emailId: string, existingFPBook: BookingFPModel): boolean {
        let userFound: boolean = false;
        existingFPBook.users.forEach(mail => {
            if (mail === emailId) {
                userFound = true;
            }
        });
        return userFound;
    };

    private ProcessFPRequest = async function (req: Request, res: Response, next: NextFunction, existingFPBook: BookingFPModel): Promise<void> {
        const config = await this.repo.GetConfig();
        {
            if (!existingFPBook) {
                this.repo.SaveBookFPDate(req.body.bookDate, req.user.emailId);
            }
            else {
                const userFound = this.IsCurrentUserInFPBookingArray(req.user.emailId, existingFPBook);
                if (userFound) {
                    const updatedUsersArray = existingFPBook.users.filter(user => { return user !== req.user.emailId; });
                    this.repo.UpdateBookFP(req.body.bookDate, updatedUsersArray);
                }
                else {
                    if (existingFPBook.users.length <= config.parkingSpotsNoFP - 1) {
                        existingFPBook.users.push(req.user.emailId);
                        this.repo.UpdateBookFP(req.body.bookDate, existingFPBook.users);
                    }
                    else {
                        return next("Booking list already full for selected day");
                    }
                }
            }
            return res.redirect("/bookfp");
        }
    };

    private ProcessFPDayByDay = function(req: Request, config: ConfigModel, bookingsStartingToday: BookingFPModel[]): Promise<BookFPRespItem[]> {
        return new Promise<BookFPRespItem[]> ((resolve, reject) => {
          const response: BookFPRespItem[] = [];
          const nextWeek: Day[] = [];
          for (let i = 0; i <= 6; i++) {
            const day = Utilities.GetSimpleDateFromToday(i);
            nextWeek.push(day);
          }

          nextWeek.forEach(day => {
            let daystatus: BookingFPStatus = BookingFPStatus.Available;
            let usersExploded: string = "";
            bookingsStartingToday.forEach(booking => {
              if (day.internalDate.getTime() === booking.bookDate.getTime()) {
                if (booking.users.length >= config.parkingSpotsNoFP) {
                  daystatus = BookingFPStatus.Full;
                }
                if (-1 !== booking.users.indexOf(req.user.emailId)) {
                  daystatus = BookingFPStatus.Booked;
                }
                booking.users.forEach(userMail => {
                  usersExploded += userMail + "\n";
                });
              }
            });
            const item: BookFPRespItem = {
              userDate: day.userDate,
              internalDate: day.internalDate,
              status: daystatus,
              usersExploded: usersExploded
            };
            response.push(item);
          });
          resolve(response);
        });
      };

    public OnGet(req: Request, res: Response) {
        const todayDate = Utilities.GetSimpleDateFromToday(0);

        this.repo.GetFPBookingsStartingToday(todayDate)
            .then(bookingsStartingToday => this.CreateFPResponse(req, bookingsStartingToday))
            .then(FPresponse => {
                res.render("bookFP", {
                    title: "Book fast parking spot",
                    content: FPresponse
                });
            });
    }

    public OnPost(req: Request, res: Response, next: NextFunction) {
        const todayDate = Utilities.GetSimpleDateFromToday(0);

        this.repo.CheckIfDateIsBooked(req.body.bookDate)
            .then(existingFPBook => this.ProcessFPRequest(req, res, next, existingFPBook));
    }
}
export default BookFPController;