import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

describe("GET /bookparking", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/bookparking")
      .expect(200, done);
  });
});


describe("POST /bookparking", () => {
  it("should return false from assert when no message is found", (done) => {
    request(app).post("/bookparking")
      .field("name", "John Doe")
      .field("email", "john@me.com")
      .end(function(err, res) {
        expect(res.error).to.be.false;
        done();
      })
      .expect(302);
  });
});