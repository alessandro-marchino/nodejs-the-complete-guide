import { validationResult } from 'express-validator';
import Product from "../model/product.js";
import { defaultHandleError } from '../util/error.js';
import { deleteFile } from '../util/file.js';

/**
 * @param {import('express').Response} res
 */
export function getAddProduct(_, res) {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postAddProduct(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false, errorMessage: errors.array()[0].msg, validationErrors: errors.mapped() });
  }
  const imageUrl = req.file.path;

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getEditProduct(req, res, next) {
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postEditProduct(req, res, next) {
  const image = req.file;
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
      if(image) {
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save()
        .then(() => res.redirect('/admin/products'));
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getProducts(req, res, next) {
  Product.find({ userId: req.user._id })
    .then(rows => {
      res.render('admin/products', { prods: rows, pageTitle: 'Admin Products', path: '/admin/products' })
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function deleteProduct(req, res) {
  console.log('here')
  Product.findById(req.params.productId)
    .then(product => {
      if(!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: req.body.productId, userId: req.user._id });
    })
    .then(() => res.status(200).json({ message: 'Success!' }))
    .catch(e => res.status(500).json({ message: 'Deleting product failed', error: e.message }));
}
