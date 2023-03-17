const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  /* const products = await Product.find({
    name: { $regex: 'ab', $options: 'i' },
  }); */
  // const products = await Product.find({}).sort('-name price');
  // const products = await Product.find({}).select('name price').limit(4).skip(1)
  const products = await Product.find({ price: { $gt: 50 } }).select('name price');
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // req.query {feature: 'true'}
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  // req.query 返回的是string
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false; 
  }
  if (company) {
    queryObject.company = company;
  }
  // https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }; // 匹配name不区分大小写
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|<=|=|>=|>)\b/g;
    // 'price>50,rate>=60' ==> "price-$gt-50,rate-$gte-60"
    const filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ['price', 'rating'];
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let result = Product.find(queryObject);

  // chain invoke function: sort, select, skip, limit
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    //https://mongoosejs.com/docs/api/query.html#query_Query-sort
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
