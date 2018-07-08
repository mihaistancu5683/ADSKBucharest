import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

describe("GET /bookfp", () => {
  it("should return 302 Found", (done) => {
    request(app).get("/bookfp")
      .expect(302)
      .end((err, res) => {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });
  });
});


describe("POST /bookfp", () => {
  it("should return 302 Found", (done) => {

    // Need a user in order to book a parking spot
    request(app).post("/signup")
      .field("email", "Parking@user.com")
      .field("password", "testpass")
      .field("confirmPassword", "testpass")
      .expect(302)
      .end((err, res) => {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });

    // Book parking spot
    request(app).post("/bookfp")
      .field("bookDate", "09/07/2018")
      .expect(302)
      .end((err, res) => {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });

    // Cancel previous booking
    request(app).post("/bookfp")
    .field("bookDate", "09/07/2018")
    .expect(302)
    .end((err, res) => {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });
});