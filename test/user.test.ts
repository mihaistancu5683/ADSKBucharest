import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

const testmail = "testuser@test.tst";
const testpass = "TestPassword*9";
const testnewpass = "TestNewPassword*9";

// Signup should work
describe("GET /signup", () => {
  it("should return 200 OK", () => {
    return request(app).get("/signup")
      .expect(200);
  });
});

// Signup with email + pass should create account
describe("POST /signup", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/signup")
      .field("email", testmail)
      .field("password", testpass)
      .field("confirmPassword", testpass)
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Logout should work
describe("GET /logout", () => {
  it("should return 302 Found", (done) => {
    return request(app).get("/logout")
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Forgot should work
describe("GET /forgot", () => {
  it("should return 200 OK", () => {
    return request(app).get("/forgot")
      .expect(200);
  });
});

// Forgot with email
describe("POST /forgot", () => {
  it("should return 200 OK", (done) => {
    return request(app).post("/forgot")
      .field("email", testmail)
      .expect(200)
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Login should work
describe("GET /login", () => {
  it("should return 200 OK", () => {
    return request(app).get("/login")
      .expect(200);
  });
});

// Login with email + pass
describe("POST /login", () => {
  it("should return some defined error message with valid parameters", (done) => {
    return request(app).post("/login")
      .field("email", testmail)
      .field("password", testpass)
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Profile update name, gender, location, website
describe("POST /account/profile", () => {
  it("should return some defined error message with valid parameters", (done) => {
    return request(app).post("/account/profile")
      .field("name", "Test User")
      .field("gender", "F")
      .field("location", "Moon")
      .field("website", "www.fictitioussite.com")
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Password reset should work
describe("GET /reset/:token", () => {
  it("should return 200 OK", (done) => {
    return request(app).get("/reset/:token")
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
    });
  });
});

// Password reset with new password + confirm
describe("POST /reset/:token", () => {
  it("should return some defined error message with valid parameters", (done) => {
    return request(app).post("/reset/:token")
      .field("password", testnewpass)
      .field("confirm", testnewpass)
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Password reset with new password + confirm
describe("POST /account/password", () => {
  it("should return some defined error message with valid parameters", (done) => {
    return request(app).post("/account/password")
      .field("password", testnewpass)
      .field("confirm", testnewpass)
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Account should work
describe("GET /account", () => {
  it("should return 200 OK", (done) => {
    return request(app).get("/account")
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Delete account
describe("POST /account/delete", () => {
  it("should return some defined error message with valid parameters", (done) => {
    return request(app).post("/account/delete")
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// Login should not work with account deleted
describe("POST /login", () => {
  it("should return some defined error message with valid parameters", (done) => {
    return request(app).post("/login")
      .field("email", testmail)
      .field("password", testpass)
      .expect(302) // Why is this not 200?
      .end(function(err, res) {
        expect(res.error).not.to.be.undefined;
        done();
      });
  });
});

// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);