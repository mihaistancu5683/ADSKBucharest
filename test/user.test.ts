import request from "supertest";
import app from "../src/app";



// Account should work
describe("GET /account", () => {
  it("should return 302 Found", (done) => {
    return request(app).get("/account")
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
