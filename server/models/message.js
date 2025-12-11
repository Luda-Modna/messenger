const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    body: {
      type: String,
      match: /^.*\S.*$/,
      minLength: 1,
    },
    room: {
      type: String,
      default: 'general',
      index: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
