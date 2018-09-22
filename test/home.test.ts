import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  it("should return 200 Ok", (done) => {
    request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});