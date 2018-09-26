import mongoose from "mongoose";

export type BookingPPModel = mongoose.Document & {
  bookDate: Date,
  spot: number,
  users: [string]
};

const bookingPPSchema = new mongoose.Schema({
  bookDate: Date,
  spot: Number,
  users: [String]
}, { timestamps: true });

const BookPP = mongoose.model("BookPP", bookingPPSchema);
export default BookPP;
