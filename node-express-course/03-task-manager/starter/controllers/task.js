const Task = require('../model/task');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error.js');

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

const createTasks = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  // 当 id 格式正确，但没有 task 会返回404
  if (!task) {
    // return res.status(404).json({ msg: 'No task with id' });
    return next(createCustomError(`No task with ${taskID}`, 404));
  }
  res.status(200).json({ task });
});
/* async (req, res) => {
  try {
    
  } catch (error) {
    // 当 id 格式不正确，会返回500
    res.status(500).json({ msg: error });
  }
}; */

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with ${taskID}`, 404));
  }
  // res.status(200).send();
  // res.status(200).json({ task });
  res.status(200).json({ task: null, status: 'success' });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;

  // new: true 返回的task是更新后的
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return next(createCustomError(`No task with ${taskID}`, 404));
  }
  res.status(200).json({ task });
  // res.status(200).json({ id: taskID, data: req.body });
});

module.exports = {
  getAllTasks,
  createTasks,
  getTask,
  deleteTask,
  updateTask,
};
