const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  compositions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Composition'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.passwordHash
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;