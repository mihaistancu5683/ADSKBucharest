import mongoose from "mongoose";

export type ConfigModel = mongoose.Document & {
  parkingSpotsNoFP: number,
  PPassignments: [{
    spot: number,
    name: string
  }]
};

const configSchema = new mongoose.Schema({
  parkingSpotsNoFP: Number,
  PPassignments: [{
    spot: Number,
    name: String
  }]
}, { timestamps: true });

const Config = mongoose.model("Config", configSchema);
export default Config;