import request from "supertest";
import app from "../src/app";

describe("GET /account", () => {
  it("should return 302 Found", (done) => {
    request(app)
      .get("/account")
      .set("Accept", "application/json")
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});