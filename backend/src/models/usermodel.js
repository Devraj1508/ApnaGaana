const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio:{
    type: String,
    default: ''
  }

}, { timestamps: true });

const userModel= mongoose.model('User', userSchema);

module.exports = userModel;