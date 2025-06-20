import Product from "../model/product.js";

export function getAddProduct(req, res) {
    if(!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
}

export function postAddProduct(req, res) {
    const product = new Product({ title: req.body.title, price: req.body.price, description: req.body.description, imageUrl: req.body.imageUrl, userId: req.user });
    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.log(e));
}

export function getEditProduct(req, res) {
    const editMode = req.query.edit;
    if(editMode !== 'true') {
        return res.redirect('/');
    }
    Product.findById(req.params.productId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: true, product: product })
        })
        .catch(e => console.log(e));
}

export function postEditProduct(req, res) {
    Product.findById(req.body.productId)
        .then(product => {
            product.title = req.body.title;
            product.price = req.body.price;
            product.description = req.body.description;
            product.imageUrl = req.body.imageUrl;
            return product.save();
        })
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.log(e));
}

export function getProducts(req, res) {
    Product.find()
        .then(rows => {
            res.render('admin/products', { prods: rows, pageTitle: 'Admin Products', path: '/admin/products' })
        })
        .catch(e => console.log(e));
}

export function postDeleteProduct(req, res) {
    Product.findByIdAndDelete(req.body.productId)
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.error(e));
}
