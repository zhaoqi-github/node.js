const os = require('os');
const path = require('path');

const user = os.userInfo();

const currentOS = {
  name: os.type(),
  release: os.release(),
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
};

console.log(__dirname);