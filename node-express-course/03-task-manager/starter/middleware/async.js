const asyncWrapper = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // 这里没有处理的错误最终会传到error-handler
    }
  };
};

module.exports = asyncWrapper;
