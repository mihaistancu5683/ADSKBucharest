import mongoose from "mongoose";

export type BookingFPModel = mongoose.Document & {
  bookDate: string,
  users: [string]
};

const bookingFPSchema = new mongoose.Schema({
  bookDate: String,
  users: [String]
}, { timestamps: true });

const BookFP = mongoose.model("BookFP", bookingFPSchema);
export default BookFP;
