import Product from "../model/product.js";

export function getAddProduct(_, res) {
    res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
}

export function postAddProduct(req, res) {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, req.user._id);
    product.save()
    // req.user.createProduct({
    //     title: req.body.title,
    //     imageUrl: req.body.imageUrl,
    //     price: req.body.price,
    //     description: req.body.description
    // })
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.log(e));
}

export function getEditProduct(req, res) {
    const editMode = req.query.edit;
    if(editMode !== 'true') {
        return res.redirect('/');
    }
    //req.user.getProducts({ where: { id: req.params.productId }})
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
    // req.user.getProducts({ where: { id: req.body.productId }})
    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.imageUrl,
        req.user._id,
        req.body.productId);
    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.log(e));
}

export function getProducts(req, res) {
    // req.user.getProducts()
    Product.fetchAll()
        .then(rows => {
            res.render('admin/products', { prods: rows, pageTitle: 'Admin Products', path: '/admin/products' })
        })
        .catch(e => console.log(e));
}

export function postDeleteProduct(req, res) {
    const id = req.body.productId;
    // req.user.getProducts({ where: { id }})
    //     .then(products => products[0].destroy())
    Product.deleteById(id)
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.error(e));
}
