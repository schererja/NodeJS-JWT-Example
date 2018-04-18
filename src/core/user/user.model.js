'use strict'

const mongoose = require('mongoose')
const crypto = require('crypto')

const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'email'],
    unique: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  username: {
    type: String,
    required: [true, 'username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password']
  },
  salt: {
    type: String,
    required: [true, 'salt']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  roles: {
    type: [{
      type: String,
      enum: ['customer', 'admin', 'user']
    }],
    default: ['user']
  },
  reset_password_token: {
    type: String
  },
  reset_password_expires: {
    type: Date
  },
  active: {
    default: true,
    required: true,
    type: Boolean
  }

})
/**
 * Used to create a salt of a given length
 *
 * @param {number} length - Length of the salt
 * @param {requestCallback} callback - Will return error and salt.
 */
const createSalt = (length, callback) => {
  if (length <= 0) {
    return callback(new Error('Length needs to be greater than 0.'))
  }
  let salt = crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
  callback(null, salt)
}
/**
 * UserSchema method to create the hashed password
 *
 * @param {string} password - String for a password
 * @param {requestCallback} callback - Will return error and Object with hashedPass and Salt
 */
userSchema.methods.createHashedPassed = (password, salt, callback) => {
  if (salt) {
    let hashedPass = crypto.createHmac('sha512', salt).update(password).digest('hex')
    callback(null, {
      hashedPass: hashedPass,
      salt: salt
    })
  } else {
    createSalt(12, (err, salt) => {
      if (err) {
        return callback(err)
      }
      let hashedPass = crypto.createHmac('sha512', salt).update(password).digest('hex')
      callback(null, {
        hashedPass: hashedPass,
        salt: salt
      })
    })
  }
}

/**
 * UserSchema method to validate password
 *
 * @param {string} username - String for the username
 * @param {string} password - String for the password
 */
userSchema.methods.validatePassword = (username, password) => {
  let User = mongoose.model('User', userSchema)
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      // FIXME: This should be handled not thrown
      throw err
    }
    let hashedPass = crypto.createHmac('sha512', user.salt)
      .update(password).digest('hex')
    if (hashedPass === user.password) {
      return true
    } else {
      return false
    }
  })
}

userSchema.pre('validate', function (next) {
  var user = this
  var salt = false
  if (!user.isModified('password')) {

  } else {
    user.createHashedPassed(user.password, salt, (err, hashedPass) => {
      if (err) {
        // FIXME: This should be handled not thrown
        throw err
      }
      user.password = hashedPass.hashedPass
      user.salt = hashedPass.salt
    })
  }
  // Used for date updates and current date
  let currentDate = new Date()
  this.updated_at = currentDate
  if (!this.created_at) {
    this.created_at = currentDate
  }
  next()
})
// TODO: NOT WORKING?
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    let retJSON = {
      firstName: ret.firstName,
      lastName: ret.lastName,
      username: ret.username,
      displayName: ret.displayName,
      email: ret.email,
      active: ret.active,
      roles: ret.roles
    }
    return retJSON
  }
})

module.exports = mongoose.model('User', userSchema)
