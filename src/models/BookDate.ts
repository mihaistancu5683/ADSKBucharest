import mongoose from "mongoose";

export type BookingDateModel = mongoose.Document & {
  bookDate: string,
  users: [string]
};

const bookingDateSchema = new mongoose.Schema({
  bookDate: String,
  users: [String]
}, { timestamps: true });

const BookDate = mongoose.model("BookDate", bookingDateSchema);
export default BookDate;
