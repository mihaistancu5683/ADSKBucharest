import mongoose from "mongoose";
import User, { UserModel } from "./User";

export type ParkingModel = mongoose.Document & {
  bookDate: string,
  userId: string
};

const parkingSchema = new mongoose.Schema({
  bookDate: String,
  userId: String
}, { timestamps: true });

// export const Parking: ParkingType = mongoose.model<ParkingType>('Parking', parkingSchema);
const Parking = mongoose.model("Parking", parkingSchema);
export default Parking;
