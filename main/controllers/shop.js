import Product from '../model/product.js';
import Order from '../model/order.js';
import { defaultHandleError } from '../util/error.js';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { validationResult } from 'express-validator';
import { computePagination } from '../util/pagination.js';
import stripeFn from 'stripe';

const ITEMS_PER_PAGE = 2;
/** @type {import('stripe').Stripe} */
const stripe = stripeFn(process.env.STRIPE_PRIVATE_KEY);

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getProducts(req, res, next) {
  const page = +req.query.page || 1;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.redirect('/');
  }
  let totalItems;
  Product.countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(rows => {
      res.render('shop/product-list', { prods: rows, pageTitle: 'All products', path: '/products', pagination: computePagination(page, totalItems, ITEMS_PER_PAGE) })
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getProductDetail(req, res, next) {
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getIndex(req, res, next) {
  const page = +req.query.page || 1;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.redirect('/');
  }
  let totalItems;
  Product.countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(rows => {
      res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/', pagination: computePagination(page, totalItems, ITEMS_PER_PAGE) })
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getCart(req, res, next) {
  req.user
    .populate('cart.items.productId')
    .then(user => res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart', products: user.cart.items }))
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postCart(req, res, next) {
  Product.findById(req.body.productId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postCartDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getOrders(req, res, next) {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders', orders }))
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getCheckoutSuccess(req, res, next) {
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function getCheckout(req, res) {
  let user;
  req.user
    .populate('cart.items.productId')
    .then(userDb => {
      user = userDb;
      return stripe.checkout.sessions.create({
        payment_method_types: [ 'card' ],
        line_items: user.cart.items.map(p => ({
          quantity: p.quantity,
          price_data: {
            unit_amount: p.productId.price * 100,
            currency: 'usd',
            product_data: {
              name: p.productId.title,
              description: p.productId.description
            }
          }
        })),
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
      });
    })
    .then(session => res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: user.cart.items,
      totalPrice: user.cart.items.reduce((acc, item) => acc + item.quantity * item.productId.price, 0).toFixed(2),
      stripe: {
        publicKey: process.env.STRIPE_PUBLIC_KEY,
        sessionId: session.id
      }
    }))
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
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

      pdfDoc.fontSize(26).text('Invoice', { underline: true });
      pdfDoc.text('-----------------------');
      pdfDoc.fontSize(14);
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.productData.price * prod.quantity;
        pdfDoc.text(`${prod.productData.title} - ${prod.quantity} x \$${prod.productData.price}`);
      });
      pdfDoc.text('-----------------------');
      pdfDoc.fontSize(20).text(`Total price: \$${totalPrice}`)

      pdfDoc.end();
    })
    .catch(err => next(err));
}
