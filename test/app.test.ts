import request from "supertest";
import app from "../src/app";

describe("GET /random-url", () => {
  it("should return 404 Not Found", (done) => {
    request(app)
      .get("/random-url")
      .set("Accept", "application/json")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});