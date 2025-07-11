import Product from '../model/product.js';
import Order from '../model/order.js';
import { defaultHandleError } from '../util/error.js';
import PDFDocument from 'pdfkit';
import { createReadStream, createWriteStream, readFile } from 'fs';
import { join } from 'path';

export function getProducts(req, res) {
  Product.find()
    .then(rows => {
      res.render('shop/product-list', { prods: rows, pageTitle: 'All products', path: '/products' })
    })
    .catch(e => defaultHandleError(e, next));
}

export function getProductDetail(req, res) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if(!product) {
        return res.redirect('/');
      }
      res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
    })
    .catch(e => defaultHandleError(e, next));
}

export function getIndex(req, res) {
  Product.find()
    .then(rows => {
      res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/' })
    })
    .catch(e => defaultHandleError(e, next));
}

export function getCart(req, res) {
  req.user
    .populate('cart.items.productId')
    .then(user => res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart', products: user.cart.items }))
    .catch(e => defaultHandleError(e, next));
}

export function postCart(req, res) {
  Product.findById(req.body.productId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(e => defaultHandleError(e, next));
}

export function postCartDeleteProduct(req, res) {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(e => defaultHandleError(e, next));
}

export function getOrders(req, res) {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders', orders }))
    .catch(e => defaultHandleError(e, next));
}

export function postOrder(req, res) {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => ({
        quantity: i.quantity,
        productData: { ...i.productId._doc }
      }));
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(e => defaultHandleError(e, next));
}

export function getCheckout(req, res) {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function getInvoice(req, res, next) {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if(!order) {
        return next(new Error('No order found.'))
      }
      if(!order.user.userId.equals(req.user._id)) {
        return next(new Error('Unauthorized.'))
      }
      const invoiceId = `invoice-${orderId}.pdf`;
      const invoicePath = join(import.meta.dirname, '..', 'data', 'invoices', invoiceId);
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(createWriteStream(invoicePath));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${invoiceId}"`);
      pdfDoc.pipe(res);

      pdfDoc.text('Hello world!');
      pdfDoc.end();
    })
    .catch(err => next(err));
}
