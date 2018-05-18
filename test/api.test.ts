import request from "supertest";
import app from "../src/app";

describe("GET /api", () => {
  it("should return 200 OK", (done) => {
    return request(app).get("/api")
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
