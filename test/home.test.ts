import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  it("should return 302 Found", (done) => {
    request(app).get("/")
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
