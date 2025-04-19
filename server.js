const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const products = require('./products');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);

// Set default layout
app.set('layout', 'layouts/main'); // Ensure this points to views/layouts/main.ejs
console.log('Layout path set to:', path.join(__dirname, 'views', 'layouts/main.ejs')); // Debug

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// In-memory cart
let cart = [];

// Routes
app.get('/', (req, res) => {
  res.render('home', { products, cart });
});

app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.render('product', { product, cart });
});

app.get('/cart', (req, res) => {
  res.render('cart', { cart });
});

app.post('/cart/add', (req, res) => {
  const productId = parseInt(req.body.productId);
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
  }
  res.redirect('/cart');
});

app.post('/cart/remove', (req, res) => {
  const productId = parseInt(req.body.productId);
  cart = cart.filter(item => item.id !== productId);
  res.redirect('/cart');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});