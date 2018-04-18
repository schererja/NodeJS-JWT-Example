const express = require('express');
const User = require('../user').model;
const jwt = require('jsonwebtoken');

const router = express.Router();
router.route('/login')
  .post((req, res) => {
    User.findOne({
      username: req.body.username,
    }, (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        res.json({
          success: false,
          message: 'Auth failed, user or password incorrect',
        });
      } else if (user) {
        user.createHashedPassed(req.body.password, user.salt, (createHashedPassedError, hashedPass) => {
          if (createHashedPassedError) {
            // FIXME: HANDLE ERROR CORRECTLY
            throw createHashedPassedError;
          }
          if (user.password !== hashedPass.hashedPass) {
            res.json({
              success: false,
              message: 'Auth failed, user or password incorrect',
            });
          } else {
            const payload = {
              id: user.id,
              roles: user.roles,
            };
            const token = jwt.sign(payload, 'ThisIsSecret', {
              expiresIn: 1440, // 24 hours
            });

            res.json({
              success: true,
              message: 'Authentication passed',
              token,
            });
          }
        });
      }
    });
  });
router.route('/logout');
module.exports = router;

