import { default as BookFP, BookingFPModel } from "../models/BookFP";
import { default as Config, ConfigModel } from "../models/Config";
import { Day } from "./classes";

const defaultConfig = {
    parkingSpotsNoFP: 5,
    PPassignments: [{
        spot: 11,
        name: "testuser1@something.com"
    },
    {
        spot: 12,
        name: "testuser2@something.com"
    }]
};

const Db = (function() {
    const GetFPBookingsStartingToday = (todayDate: Day): Promise<BookingFPModel[]> => {
        return new Promise<BookingFPModel[]> ((resolve, reject) => {
            BookFP.find({bookDate: { $gte : todayDate.internalDate }}, (err, bookingsStartingToday: BookingFPModel[]) => {
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

    const GetConfig = (): Promise<ConfigModel> => {
        return new Promise<ConfigModel> ((resolve, reject) => {
            Config.findOne({parkingSpotsNoFP: { $gte : 1 }}, (err: Error, config: ConfigModel) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (config == undefined) {
                        const initial = new Config(defaultConfig);
                        initial.save((err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                    else {
                        resolve(config);
                    }
                }
            });
        });
    };

    return {
        GetFPBookingsStartingToday: GetFPBookingsStartingToday,
        CheckIfDateIsBooked: CheckIfDateIsBooked,
        SaveBookFPDate: SaveBookFPDate,
        UpdateBookFP: UpdateBookFP,
        GetConfig: GetConfig
    };
})();
export default Db;
