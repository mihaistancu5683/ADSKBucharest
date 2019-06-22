import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const ADSK_CLIENT_ID = process.env["ADSK_CLIENT_ID"];
export const ADSK_CLIENT_SECRET = process.env["ADSK_CLIENT_SECRET"];
export const ADSK_CALLBACK_URI = process.env["ADSK_CALLBACK_URI"];

export const MONGODB_URI = process.env["MONGODB_URI"];

if (!ENVIRONMENT) {
    logger.error("No node.js environment. Set NODE_ENV environment variable.");
    process.exit(1);
}

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

if (!ADSK_CLIENT_ID) {
    logger.error("No client ID. Set ADSK_CLIENT_ID environment variable.");
    process.exit(1);
}

if (!ADSK_CLIENT_SECRET) {
    logger.error("No client secret. Set ADSK_CLIENT_SECRET environment variable.");
    process.exit(1);
}

if (!ADSK_CALLBACK_URI) {
    logger.error("No callback URI. Set ADSK_CALLBACK_URI environment variable.");
    process.exit(1);
}