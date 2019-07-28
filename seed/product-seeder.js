/*var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://denusUser:Pitas67575051@cluster0-khnuz.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true
    }
);

var products = [
    new Product({
    imagePath: 'https://mosaic03.ztat.net/vgs/media/article-image-mhq/L4/25/1H/08/7Q/11/L4251H087-Q11@10.3.jpg?imwidth=1800',
    title: 'Bag 001',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien sem, laoreet a lorem id, pulvinar vestibulum tellus. Pellentesque tempor, arcu vel efficitur posuere, felis magna mollis metus, at volutpat nulla lectus ut sapien. Proin iaculis iaculis eros. In hac habitasse platea dictumst. Fusce eu enim eget lectus aliquam sodales.',
    price: 30

}),
    new Product({
        imagePath: 'https://n2.sdlcdn.com/imgs/i/e/w/Untitled_18-16413.jpg',
        title: 'Bag 002',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien sem, laoreet a lorem id, pulvinar vestibulum tellus. Pellentesque tempor, arcu vel efficitur posuere, felis magna mollis metus, at volutpat nulla lectus ut sapien. Proin iaculis iaculis eros. In hac habitasse platea dictumst. Fusce eu enim eget lectus aliquam sodales.',
        price: 35

    }),
    new Product({
        imagePath: 'https://cdn.shopify.com/s/files/1/0757/9123/products/linjer-tulip-bag-natural-yellow-1-front_1512x.jpg?v=1547262780',
        title: 'Bag 003',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien sem, laoreet a lorem id, pulvinar vestibulum tellus. Pellentesque tempor, arcu vel efficitur posuere, felis magna mollis metus, at volutpat nulla lectus ut sapien. Proin iaculis iaculis eros. In hac habitasse platea dictumst. Fusce eu enim eget lectus aliquam sodales.',
        price: 35

    }),
    new Product({
        imagePath: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/8629519/2019/3/26/1a56821e-1ea5-43ab-8f76-0d4f7536a0d81553579437357-United-Colors-of-Benetton-Grey-Solid-Handheld-Bag-9015535794-1.jpg',
        title: 'Bag 004',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien sem, laoreet a lorem id, pulvinar vestibulum tellus. Pellentesque tempor, arcu vel efficitur posuere, felis magna mollis metus, at volutpat nulla lectus ut sapien. Proin iaculis iaculis eros. In hac habitasse platea dictumst. Fusce eu enim eget lectus aliquam sodales.',
        price: 50

    }),
    new Product({
        imagePath: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/8629519/2019/3/26/1a56821e-1ea5-43ab-8f76-0d4f7536a0d81553579437357-United-Colors-of-Benetton-Grey-Solid-Handheld-Bag-9015535794-1.jpg',
        title: 'Bag 005',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sapien sem, laoreet a lorem id, pulvinar vestibulum tellus. Pellentesque tempor, arcu vel efficitur posuere, felis magna mollis metus, at volutpat nulla lectus ut sapien. Proin iaculis iaculis eros. In hac habitasse platea dictumst. Fusce eu enim eget lectus aliquam sodales.',
        price: 100

    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}