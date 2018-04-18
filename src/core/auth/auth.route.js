const express = require('express');
const User = require('../user').model;
const jwt = require('jsonwebtoken');
const router = express.Router();
router.route('/login')
  .post((req, res) => {
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) {
        console.log(err);
      }
      if (!user) {
        res.json({
          success: false,
          message: 'Auth failed, user or password incorrect'
        });
      } else if (user) {
        user.createHashedPassed(req.body.password, user.salt, (err, hashedPass) => {
          if (err) {
            // FIXME: HANDLE ERROR CORRECTLY
            console.log(err)
          }
          if (user.password !== hashedPass.hashedPass) {
            res.json({
              success: false,
              message: 'Auth failed, user or password incorrect'
            });
          } else {
            let payload = {
              id: user.id,
              roles: user.roles
            };
            let token = jwt.sign(payload, 'ThisIsSecret', {
              expiresIn: 1440 // 24 hours
            });

            res.json({
              success: true,
              message: 'Authentication passed',
              token: token
            });
          }
        });
      }
    });
  })
router.route('/logout');
module.exports = router;

