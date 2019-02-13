const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportJWT = require('passport-jwt');
mongoose.Promise = require('bluebird');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const User = require('./core/user');
const auth = require('./core/auth/').route;

const app = express();
const port = process.env.PORT || 3000;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: 'ThisIsSecret',
};
const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  User.model.findOne({ _id: jwtPayload.id }, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});
const db = mongoose.connect('mongodb://node-dev:password@mongo:27017/users', {
  useMongoClient: true,
});
passport.use(strategy);
app.use(passport.initialize());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use('/', auth);
app.use('/api', passport.authenticate('jwt', { session: false }), User.route);

app.listen(port);

console.log(`Server started at ${port}`);
