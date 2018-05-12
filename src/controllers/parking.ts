import nodemailer from "nodemailer";
import { Request, Response } from "express";

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

/**
 * GET /bookparking
 * Book parking form page.
 */
export let getBookings = (req: Request, res: Response) => {
  res.render("parking", {
    title: "Book parking spot"
  });
};

/**
 * POST /bookparking
 * Send a bookparking form via Nodemailer.
 */
export let postBooking = (req: Request, res: Response) => {
  req.assert("name", "Name cannot be blank").notEmpty();
  req.assert("email", "Email is not valid").isEmail();
  req.assert("message", "Message cannot be blank").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/bookparking");
  }

  const mailOptions = {
    to: "your@email.com",
    from: `${req.body.name} <${req.body.email}>`,
    subject: "Booking Form",
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash("errors", { msg: err.message });
      return res.redirect("/bookparking");
    }
    req.flash("success", { msg: "Email has been sent successfully!" });
    res.redirect("/bookparking");
  });
};
