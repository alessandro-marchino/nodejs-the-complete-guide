const Product = require('../model/product');

exports.getAddProduct = (_, res) => {
    res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
};

exports.postAddProduct = (req, res) => {
    Product.create({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
    })
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.log(e));
};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if(editMode !== 'true') {
        return res.redirect('/');
    }
    Product.findByPk(req.params.productId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: true, product })
        })
        .catch(e => console.log(e));
};

exports.postEditProduct = (req, res) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(id, title, imageUrl, description, price);
    product.save(() => res.redirect('/admin/products'));
};

exports.getProducts = (_, res) => {
    Product.findAll()
        .then((rows) => {
            res.render('admin/products', { prods: rows, pageTitle: 'Admin Products', path: '/admin/products' })
        })
        .catch(e => console.log(e));
};

exports.postDeleteProduct = (req, res) => {
    const id = req.body.productId;
    Product.delete(id, () => res.redirect('/admin/products'));
}
