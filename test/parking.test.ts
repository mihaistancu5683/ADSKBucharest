import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

describe("GET /bookparking", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/bookparking")
      .expect(200)
      .end((err, res) => {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });
  });
});


describe("POST /bookparking", () => {
  it("should return false from assert when no message is found", (done) => {
    request(app).post("/bookparking")
      .field("name", "John Doe")
      .field("email", "john@me.com")
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