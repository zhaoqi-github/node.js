const mongoose = require('mongoose');
//每一个 Schema 对应 MongoDB 中的一个集合（collection）
//collection就是table结构
const messageSchema = new mongoose.Schema(
  {
    message: {
      text: { type: String, require: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId, //主键: _id
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//model具有操作数据库的能力
module.exports = mongoose.model('Messages', messageSchema);
