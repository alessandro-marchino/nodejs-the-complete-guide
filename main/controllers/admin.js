import { validationResult } from 'express-validator';
import Product from "../model/product.js";
import { defaultHandleError } from '../util/error.js';

export function getAddProduct(req, res) {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
}

export function postAddProduct(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false, errorMessage: errors.array()[0].msg, validationErrors: errors.mapped() });
  }
  console.log(req.body);
  console.log(req.file);
  return res.redirect('/admin/add-product');

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    userId: req.user
  });
  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch(e => defaultHandleError(e, next));
}

export function getEditProduct(req, res) {
  const editMode = req.query.edit;
  if(editMode !== 'true') {
    return res.redirect('/');
  }
  Product.findOne({ _id: req.params.productId, userId: req.user._id })
    .then(product => {
      if(!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: true, product: product })
    })
    .catch(e => defaultHandleError(e, next));
}

export function postEditProduct(req, res) {
  Product.findById(req.body.productId)
    .then(product => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: true, product, errorMessage: errors.array()[0].msg, validationErrors: errors.mapped() });
      }
      if(!product.userId._id.equals(req.user._id)) {
        return res.redirect('/');
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      return product.save()
        .then(() => res.redirect('/admin/products'));
    })
    .catch(e => defaultHandleError(e, next));
}

export function getProducts(req, res) {
  Product.find({ userId: req.user._id })
    .then(rows => {
      res.render('admin/products', { prods: rows, pageTitle: 'Admin Products', path: '/admin/products' })
    })
    .catch(e => defaultHandleError(e, next));
}

export function postDeleteProduct(req, res) {
  Product.deleteOne({ _id: req.body.productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(e => defaultHandleError(e, next));
}
