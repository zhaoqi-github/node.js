const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoutes');
const port = process.env.PORT || 5000;

const app = express();
const socket = require('socket.io');

require('dotenv').config(); //因为这个才可以直接用process.env.MONGO_URL去获取.env文件中定义的环境变量

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //这俩现象设置是为了清楚链接mongoose时的警告
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch(err => {
    console.log(err);
  });

const server = app.listen(port, () => {
  console.log(`SErver started on Port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credential: true,
  },
});

//全局变量
global.onlineUsers = new Map();
io.on('connection', socket => {
  global.chatSocket = socket;

  socket.on('add-user', userId => {
    //在线用户和其对应的scoket
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', data => {
    //sendUserSocket对应to的_id
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  });
});
