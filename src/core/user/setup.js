const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/eden_dev_users')
const User = require('./user.model')

var admin = new User({
  username: 'test',
  email: 'test@gmail.com',
  roles: 'admin',
  password: 'test'
})
admin.save((err) => {
  if (err) {
    throw err
  }
  return admin
})

/* validatePassword('admin', 'password', (err, validPassword) => {

  console.log(validPassword)
})
 */
/*
User.find({}, 'username email',(err, users) => {
  if (err) throw err
  console.log(validatePassword('admin', 'password'))

}) */
