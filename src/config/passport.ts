import passport from "passport";
import request from "request";
import passportLocal from "passport-local";
import passportOauth2 from "passport-oauth2";
import _ from "lodash";

// import { User, UserType } from '../models/User';
import { default as User, UserModel } from "../models/User";
import { Request, Response, NextFunction } from "express";

const LocalStrategy = passportLocal.Strategy;
const OAuth2Strategy = passportOauth2.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user);
});

passport.deserializeUser((obj, done) => {
  done(undefined, obj);
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: "Invalid email or password." });
    });
  });
}));


/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Forge.
 */
OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
  const options = {
      url: "https://developer.api.autodesk.com/userprofile/v1/users/@me",
      headers: {
          "Authorization": "Bearer " + accessToken,
      }
  };

  request(options, callback);

  function callback(error: Error, response: any, body: Body) {
      if (error || response.statusCode !== 200) {
          return done(error);
      }
      const profile = JSON.parse(body.toString());
      return done(undefined, profile);
  }
};

const oauth2_config = {
  authorizationURL: "https://developer.api.autodesk.com/authentication/v1/authorize",
  tokenURL: "https://developer.api.autodesk.com/authentication/v1/gettoken",
  clientID: process.env.ADSK_CLIENT_ID,
  clientSecret: process.env.ADSK_CLIENT_SECRET,
  callbackURL: process.env.ADSK_CALLBACK_URI
};

passport.use(new OAuth2Strategy(oauth2_config,
  function(accessToken: string, refreshToken: string, profile: any, done: Function) {
    done(undefined, profile);
  }
));

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/forge");
};

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split("/").slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
