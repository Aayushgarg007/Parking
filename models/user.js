const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  carNumber: String,
  logs: [
    // {
    //   entryTime: 
    // }
  ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);