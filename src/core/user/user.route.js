const express = require('express');
const User = require('./user.model');

let user = '';

const router = express.Router();
router.all((req, res, next) => {
});
router.route('/users')
  .get((req, res) => {
    if(!req.user.roles.includes('admin')){
      User.find((err, users) => {
        if (err) {
          res.send(err);
        }
        res.json(users);
      });
    } else {
      User.find((err, users) => {
        if (err) {
          res.send(err);
        }
        res.json(users);
      });
    }

  })
  .post((req, res) => {
    if(req.user.roles.includes('admin')){
      return res.send(200).end();
    };
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    user.save((err) => {
      if (err) {
        // TODO: Check for duplicate
        return res.status(403).json({
          code: 403,
          message: 'Forbidden',
          description: 'Server understood the request, but refused to fulfill it.',
          error: err,
        }).end()
      }
      return res.status(200).json({
        code: 200,
        message: 'OK',
        description: 'Request Successful',
      }).end();
    });
  });
router.route('/users/:id')
  .get((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  })
  .put((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return res.status(403).json({
          code: 403,
          message: 'Forbidden',
          description: 'Server understood the request, but refused to fulfill it.',
          error: err,
        }).end();
      }
      if (req.body.firstName) {
        user = req.body;
        return res.json({
          code: '200',
          message: 'OK',
        });
      }
      user.save((err) => {
        if (err) {
          return res.status(403).json({
            code: 403,
            message: 'Forbidden',
            description: 'Server understood the request, but refused to fulfill it.',
            error: err,
          }).end();
        }
        return res.status(400).end();
      });
    });
  })
  .delete((req, res) => {
    res.status(200);
  });
module.exports = router;
