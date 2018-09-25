import mongoose from "mongoose";

export type BookingFPModel = mongoose.Document & {
  bookDate: Date,
  users: [string]
};

const bookingFPSchema = new mongoose.Schema({
  bookDate: Date,
  users: [String]
}, { timestamps: true });

const BookFP = mongoose.model("BookFP", bookingFPSchema);
export default BookFP;
