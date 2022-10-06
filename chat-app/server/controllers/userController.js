const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    //检查username是否存在
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) return res.json({ msg: 'Username already used', status: false });
    //检查email是否存在
    const emailCheck = await User.findOne({ email });
    if (emailCheck) return res.json({ msg: 'Email already used', status: false });
    //加密password
    const hashedPassword = await bcrypt.hash(password, 10);
    //新建user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //用户名对不对
    const user = await User.findOne({ username });
    if (!user) return res.json({ msg: 'Incorrect username or password', status: false });
    //密码对不对
    const isPasswordValid = await bcrypt.compare(password, user.password); //和数据库的密码比较
    if (!isPasswordValid) return res.json({ msg: 'Incorrect username or password', status: false });

    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    //更新数据
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true } //if true, return the modified document rather than the original
    );

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    //Users.find({ _id: { $ne: req.params.id } }) 查找除了本用户之外的其他用户
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ]);
    return res.json({ status: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: 'User id is required ' });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};
