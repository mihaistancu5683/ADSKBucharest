import { default as BookFP, BookingFPModel } from "../models/BookFP";
import { default as Config, ConfigModel } from "../models/Config";
import { IRepository } from "../interfaces/interfaces";
import Day from "../classes/day";

class MongoDbRepository implements IRepository {
    private _defaultConfig = {
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
    constructor() {
    }
    GetFPBookingsStartingToday = (todayDate: Day): Promise<BookingFPModel[]> => {
        return new Promise<BookingFPModel[]>((resolve, reject) => {
            BookFP.find({ bookDate: { $gte: todayDate.internalDate } }, (err, bookingsStartingToday: BookingFPModel[]) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(bookingsStartingToday);
                }
            });
        });
    };

    CheckIfDateIsBooked = (bookDate: Day): Promise<BookingFPModel> => {
        return new Promise<BookingFPModel>((resolve, reject) => {
            BookFP.findOne({ bookDate: bookDate }, (err, existingFPBook: BookingFPModel) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(existingFPBook);
                }
            });
        });
    };

    SaveBookFPDate = (bookDate: Day, emailId: string): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
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

    UpdateBookFP = (bookDate: Day, users: string[]): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            BookFP.updateOne({ bookDate: bookDate }, { bookDate: bookDate, users: users }, (err, resp: BookingFPModel) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };

    GetConfig = (): Promise<ConfigModel> => {
        return new Promise<ConfigModel>((resolve, reject) => {
            Config.findOne({ parkingSpotsNoFP: { $gte: 1 } }, (err: Error, config: ConfigModel) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (config == undefined) {
                        const initial = new Config(this._defaultConfig);
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
}
// class TestRepository implements IRepository {
//     private data: any[] = [];
//     add2(obj: string): string {
//         if (this.data.length == 2) {
//             return "full";
//         } else {
//             this.data.push(obj);
//             return "added";
//         }
//     }
// }

export default MongoDbRepository;

