
var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Client = require('../models/client_db');
var multer = require('multer');
var User = require('../models/user')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
   },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

/*var fileFilter = function(req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};*/

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
}});
    /*fileFilter: fileFilter
});*/

var Product = require('../models/product');
var Order = require('../models/order');






/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Express', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe") (
        "sk_test_RS80qi6BgeeVl5XK1i1XJ8Up00qDBRjWsn"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken,
        description: "Test Charge",
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order= new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

router.get('/product-view/:id', function(req, res, next) {
    var productId = req.params.id;
    Product.findById(productId, function(err, product) {
       if (err) {
            return res.redirect('/');
        }
       res.render('shop/product-view', { product:  product });
    });
});
router.get('/edit/:id', function(req, res, next) {
    var productId = req.params.id;
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        res.render('shop/edit', { product:  product });
    });
});

router.post('/edit/:id', upload.single('productImage'), function (req, res, next) {
    var databulk = {
        title: req.body.title,
        price: req.body.price,
        imagePath: req.file.path,
        description: req.body.description,
        color: req.body.color,
        material: req.body.material
    }
    Product.findByIdAndUpdate(req.params.id, databulk, function (err) {
        if (err) {
            res.redirect('shop/edit/' + req.params.id);
        } else {
            res.redirect('/product-mgt');
        }
    });
});


router.get('/delete/:id', function(req, res, next) {
    Product.findOneAndRemove(req.params.id, function(err, project) {
        if(err) {
            res.redirect('/product-mgt');
        } else {
            res.redirect('/product-mgt');
        }
    });
});

router.get('/product-mgt', function(req, res, next) {
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/product-mgt', { products: productChunks });
    });
});

router.get('/clientupload-fullcontrol', function(req, res, next) {
    Client.find(function(err, docs) {
        var clientChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            clientChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/clientupload-fullcontrol', { clients: clientChunks });
    });
});

router.get('/clientupload-mgt', function(req, res, next) {
    Client.find({isApproved: 'pending'},function(err, docs) {
        var clientChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            clientChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/clientupload-mgt', { clients: clientChunks });
    });
});

router.get('/delete-upload/:id', function(req, res, next) {
    Client.findOneAndRemove(req.params.id, function(err, project) {
        if(err) {
            res.redirect('/clientupload-fullcontrol');
        } else {
            res.redirect('/clientupload-fullcontrol');
        }
    });
});

router.get('/approve/:id', function(req, res, next) {
    Client.findById(req.params.id, function (err, client) {
        if (err) {
            return res.redirect('/');
        }
        Client.findByIdAndUpdate(req.params.id, {isApproved: 'approved'}, function (err) {
            if (err) {
                console.log('not working!')
                res.redirect('/clientupload-mgt' + req.params.id);
            } else {
                console.log('seems works!')
                res.redirect('/clientupload-mgt');
            }
        });
    });
});
router.get('/disapprove/:id', function(req, res, next) {
    Client.findById(req.params.id, function (err, client) {
        if (err) {
            return res.redirect('/');
        }
        Client.findByIdAndUpdate(req.params.id, {isApproved: 'disapproved'}, function (err) {
            if (err) {
                console.log('not working!')
                res.redirect('/clientupload-mgt' + req.params.id);
            } else {
                console.log('seems works!')
                res.redirect('/clientupload-mgt');
            }
        });
    });
});

router.get('/add_product', isLoggedIn, isAdmin, function (req, res, next) {
    var addedMsg = req.flash('productadded')[0];
    req.flash('productadded', 'Successfully added new product!');
    res.render('shop/add_product',{addedMsg: addedMsg, noMessages: !addedMsg})
});

router.post('/add_product', upload.single('productImage'), function (req, res, next) {
    var title = req.body.title;
    var price = req.body.price;
    var imagePath = req.file.path;
    var description = req.body.description;
    var color = req.body.color;
    var material = req.body.material;
        var newProduct = new Product({
            title: title,
            price: price,
            imagePath: imagePath,
            description: description,
            color: color,
            material: material,
        });
        Product.createProduct(newProduct, function(err, product) {
            if (err) throw err;
            req.flash('productadded', 'Successfully added new product!');
            res.redirect('/add_product');
        });
});

router.get('/clientdb', function (req, res, next) {
    Client.find({isApproved: 'approved'}, function(err, docs) {
        var clientChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            clientChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/clientdb', { clients: clientChunks });
    });
});


router.post('/client_upload/:id', upload.single('customerImage'), function (req, res, next) {
    var productid = req.params.id;
    var user = req.body.email;
    var clientImagePath = req.file.path;
    var newClient = new Client({
        user: req.user.id,
        productid: productid,
        clientImagePath: clientImagePath
        });
        Client.createClient(newClient, function(err, client) {
            if (err) throw err;
            console.log(client);
            req.flash('photoadded', 'Successfully Added Photo!');
            res.redirect('/user/profile');
        });
});


router.get('/admin', function (req, res, next) {
    res.render('admin/admin');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
};

function isAdmin(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user.isAdmin)
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};
