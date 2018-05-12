import mongoose from "mongoose";
import User, { UserModel } from "./User";

export type ParkingModel = mongoose.Document & {
  bookDate: Date,
  users: [UserModel],
};

const parkingSchema = new mongoose.Schema({
  bookDate: Date,
  users: [User]
}, { timestamps: true });

// export const Parking: ParkingType = mongoose.model<ParkingType>('Parking', parkingSchema);
const Parking = mongoose.model("Parking", parkingSchema);
export default Parking;
