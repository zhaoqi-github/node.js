const express = require('express');
const app = express();
const { products } = require('./data');

app.get('/', (req, res) => {
  res.send('<h1> Home Page</h1><a href="/api/products">products</a>');
});
app.get('/api/products', (req, res) => {
  const newProducts = products.map(product => {
    const { id, name, image } = product;
    return { id, name, image };
  });

  res.json(newProducts);
});
// http://localhost:5001/api/products/1
app.get('/api/products/:productID', (req, res) => {
  // console.log(req)
  // console.log(req.params) // { productID: '1' }
  const { productID } = req.params;

  const singleProduct = products.find(product => product.id === Number(productID));
  if (!singleProduct) {
    return res.status(404).send('Product Does Not Exist');
  }

  return res.json(singleProduct);
});

// http://localhost:5001/api/products/1/reviews/2
app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
  console.log(req.params); // { productID: '1', reviewID: '2' }
  res.send('hello world');
});

// http://localhost:5001/api/v1/query?search=abc&limit=1
app.get('/api/v1/query', (req, res) => {
  console.log(req); // { search: 'abc', limit: '1' }
  const { search, limit } = req.query;
  let sortedProducts = [...products];

  if (search) {
    sortedProducts = sortedProducts.filter(product => {
      return product.name.startsWith(search);
    });
  }
  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit));
  }
  if (sortedProducts.length < 1) {
    // res.status(200).send('no products matched your search');
    return res.status(200).json({ sucess: true, data: [] }); // 记得这里要return
  }
  res.status(200).json(sortedProducts);
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000....');
});
