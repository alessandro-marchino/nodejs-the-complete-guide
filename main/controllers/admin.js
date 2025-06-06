const Product = require("../model/product");

exports.getAddProduct = (_, res) => {
    res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save()
    // req.user.createProduct({
    //     title: req.body.title,
    //     imageUrl: req.body.imageUrl,
    //     price: req.body.price,
    //     description: req.body.description
    // })
        .then(() => res.redirect('/admin/products'))
        .catch(e => console.log(e));
};

exports.getEditProduct = (req, res) => {
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
};

// exports.postEditProduct = (req, res) => {
//     req.user.getProducts({ where: { id: req.body.productId }})
//         .then(products => {
//             const product = products[0];
//             if(!product) {
//                 throw new Error('Product not present');
//             }
//             product.title = req.body.title;
//             product.imageUrl = req.body.imageUrl;
//             product.price = req.body.price;
//             product.description = req.body.description;
//             return product.save();
//         })
//         .then(() => res.redirect('/admin/products'))
//         .catch(e => console.log(e));
// };

exports.getProducts = (req, res) => {
    // req.user.getProducts()
    Product.fetchAll()
        .then(rows => {
            res.render('admin/products', { prods: rows, pageTitle: 'Admin Products', path: '/admin/products' })
        })
        .catch(e => console.log(e));
};

// exports.postDeleteProduct = (req, res) => {
//     const id = req.body.productId;
//     req.user.getProducts({ where: { id }})
//         .then(products => products[0].destroy())
//         .then(() => res.redirect('/admin/products'))
//         .catch(e => console.error(e));
// }
