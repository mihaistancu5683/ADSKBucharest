import request from "supertest";
import app from "../src/app";

const chai = require("chai");
const expect = chai.expect;

const testmail = "testuser@test.tst";
const testpass = "TestPassword*9";
const testnewpass = "TestNewPassword*9";

// Signup should work
describe("GET /auth/local/signup", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/signup")
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

// Signup with email + pass should create account
describe("POST /auth/local/signup", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/signup")
      .field("email", testmail)
      .field("password", testpass)
      .field("confirmPassword", testpass)
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

// Logout should work
describe("GET /auth/logout", () => {
  it("should return 302 Found", (done) => {
    return request(app).get("/logout")
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

// Forgot should work
describe("GET /auth/local/forgot", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/forgot")
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

// Forgot with email
describe("POST /auth/local/forgot", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/forgot")
      .field("email", testmail)
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

// Login should work
describe("GET /auth/local/login", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/login")
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

// Login with email + pass
describe("POST /auth/local/login", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/login")
      .field("email", testmail)
      .field("password", testpass)
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

// Profile update name, gender, location, website
describe("POST /account/profile", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/account/profile")
      .field("name", "Test User")
      .field("gender", "F")
      .field("location", "Moon")
      .field("website", "www.fictitioussite.com")
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

// Password reset should work
describe("GET /reset/:token", () => {
  it("should return 302 Found", (done) => {
    return request(app).get("/reset/:token")
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

// Password reset with new password + confirm
describe("POST /reset/:token", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/reset/:token")
      .field("password", testnewpass)
      .field("confirm", testnewpass)
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

// Password reset with new password + confirm
describe("POST /account/password", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/account/password")
      .field("password", testnewpass)
      .field("confirm", testnewpass)
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

// Delete account
describe("POST /account/delete", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/account/delete")
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

// Login should not work with account deleted
describe("POST /auth/local/login", () => {
  it("should return 302 Found", (done) => {
    return request(app).post("/login")
      .field("email", testmail)
      .field("password", testpass)
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

// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);