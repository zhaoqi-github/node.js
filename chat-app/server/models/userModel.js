const mongoose = require('mongoose');
//每一个 Schema 对应 MongoDB 中的一个集合（collection）
//collection就是table结构
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 3,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: '',
  },
});

//model具有操作数据库的能力
module.exports = mongoose.model('User', userSchema);
