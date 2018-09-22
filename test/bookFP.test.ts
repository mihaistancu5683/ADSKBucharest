import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

describe("GET /bookfp", () => {
  it("should return 302 Found", (done) => {
    request(app)
      .get("/bookfp")
      .set("Accept", "application/json")
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /bookfp", () => {
  it("should return 302 Found", (done) => {
    // Book parking spot
    request(app)
      .post("/bookfp")
      .send({ bookDate: "09/07/2018" })
      .set("Accept", "application/json")
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });

  // Cancel booking
    request(app)
      .post("/bookfp")
      .send({ bookDate: "09/07/2018" })
      .set("Accept", "application/json")
      .expect(302)
      .end((err, res) =>  {
        if (err) return done(err);
        done();
      });
  });
});