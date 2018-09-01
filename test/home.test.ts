import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  it("should return 200 Ok", (done) => {
    request(app).get("/")
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
