import { default as BookFP, BookingFPModel } from "../models/BookFP";
import { Day } from "./classes";

const Db = (function() {
    const GetFPBookingsStartingToday = (todayDate: Day): Promise<BookingFPModel[]> => {
        return new Promise<BookingFPModel[]> ((resolve, reject) => {
            BookFP.find({bookDate: { $gte : todayDate.date }}, (err, bookingsStartingToday: BookingFPModel[]) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(bookingsStartingToday);
                }
            });
        });
    };

    const CheckIfDateIsBooked = (bookDate: Day): Promise<BookingFPModel> => {
        return new Promise<BookingFPModel> ((resolve, reject) => {
            BookFP.findOne({bookDate: bookDate}, (err, existingFPBook: BookingFPModel) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(existingFPBook);
                }
            });
        });
    };

    const SaveBookFPDate = (bookDate: Day, emailId: string): Promise<any> => {
        return new Promise<any> ((resolve, reject) => {
            const newBooking = new BookFP({
                bookDate: bookDate,
                users: [emailId]
            });
            newBooking.save((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
            });
        });
    };

    const UpdateBookFP = (bookDate: Day, users: string[]): Promise<any> => {
        return new Promise<any> ((resolve, reject) => {
            BookFP.updateOne({bookDate: bookDate}, {bookDate: bookDate, users: users} , (err, resp: BookingFPModel) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
              });
        });
    };

    return {
        GetFPBookingsStartingToday: GetFPBookingsStartingToday,
        CheckIfDateIsBooked: CheckIfDateIsBooked,
        SaveBookFPDate: SaveBookFPDate,
        UpdateBookFP: UpdateBookFP
    };
})();
export default Db;
