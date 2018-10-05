import { Request, Response, NextFunction } from "express";
import {default as MongoDbRepository } from "../classes/repository";
import {default as BookFPController } from "../classes/bookFP";

/**
 * GET /bookfp
 * Book parking form page.
 */export let getBookings = (req: Request, res: Response) => {
    const repo = new MongoDbRepository();
    const controller = new BookFPController(repo);
    const ret1 = controller.OnGet(req, res);
  };

/**
 * POST /bookdate
 * Send a bookdate to db.
 */
export let postBooking = (req: Request, res: Response, next: NextFunction) => {
  const repo = new MongoDbRepository();
  const controller = new BookFPController(repo);
  const ret2 = controller.OnPost(req, res, next);

};
