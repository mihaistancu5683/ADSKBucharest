import { Request, Response } from "express";
const request = require("request");

function authStep1 (req: Request, res: Response) {
  return new Promise(  function(resolve, reject) {
    const step1url =
      "https://developer.api.autodesk.com/authentication/v1/authorize" +
      "?response_type=code" +
      "&client_id=" + process.env.ADSK_CLIENT_ID +
      "&redirect_uri=" + process.env.ADSK_CALLBACK_URI +
      "&scope=data:read";
    res.redirect(step1url);
  });
}

function authStep2 (req: Request, res: Response) {
  return new Promise(  function(resolve, reject) {
    const data =
      "client_id=" + process.env.ADSK_CLIENT_ID + "&" +
      "client_secret=" + process.env.ADSK_CLIENT_SECRET + "&" +
      "grant_type=authorization_code&" +
      "code=" + req.query.code + "&" +
      "redirect_uri=" + process.env.ADSK_CALLBACK_URI;

    const options = {
      url: "https://developer.api.autodesk.com/authentication/v1/gettoken",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: data
    };
    request(options, function (error: Error, response: Response, body: Body) {
      if (!error) {
        resolve(body);
      }
      else {
        reject(error);
      }
    });
  });
}

function authStep3 (req: Request, res: Response, body: Object) {
  return new Promise(  function(resolve, reject) {
    const auth_token = JSON.parse(body.toString()).auth_token;
    const options = {
      url: "https://developer.api.autodesk.com/userprofile/v1/users/@me",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + auth_token
      }
    };
    request(options, function (error: Error, response: Response, body2: Body) {
      if (!error) {
        resolve(body2);
        res.render("account/signup", {
          title: "userprofile response" + body2
        });
      }
      else {
        reject(error);
      }
    });
  });
}

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  if (!req.query.code) {
    authStep1(req, res);
  }
  else {
    authStep2(req, res).then(function (authToken) {
      authStep3(req, res, authToken);
    });
  }
};
