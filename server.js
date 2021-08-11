const express = require('express');
const fs = require('fs');
const data = require('./data');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('/products', (req, res) => {
    res.send(data.products);
});
app.get('/categories', (req, res) => {
    res.send(data.categories);
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const product = data.products.find(p => p.id == productId);
    if (product) res.send(product);
});

app.post('/cart', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            fileData = JSON.parse(data);
            req.body.id = fileData.cart.length + 1;
            fileData.cart.push(req.body);
            fs.writeFile('data.json', JSON.stringify(fileData), 'utf8', function callback(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("successfully post item in cart...");
                    res.send(fileData.cart);
                }
            });
        }
    });

});

app.put('/cart/:id', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, obj) {
        if (err) console.log('Error in cart put...');
        else {
            fileData = JSON.parse(obj);
            item = fileData.cart.find(i => i.product.id == req.body.product.id);
            item.quantity = Number(req.body.quantity);
            fs.writeFile('data.json', JSON.stringify(fileData), 'utf8', function callback(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("successfully put in cart quantity");
                    res.send(fileData.cart);
                }
            });
        }
    });
});

app.get('/cart', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, obj) {
        if (err) console.log('Error in reading file while retrieving objects of cart');
        else {
            fileData = JSON.parse(obj);
            res.send(fileData.cart);
        }
    });
});

app.delete('/cart/:itemId', (req, res) => {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            obj.cart = obj.cart.filter((item) => item.id != req.params.itemId);
            json = JSON.stringify(obj);
            fs.writeFile('data.json', json, 'utf8', function callback(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("successfully deleted item from cart...");
                }
            });
        }
    });

    res.send(req.body);
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});
