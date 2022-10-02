const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config(); //因为这个才可以直接用process.env.MONGO_URL去获取.env文件中定义的环境变量

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
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
