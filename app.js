const express = require('express');
const app = express();
const fs = require('fs');

app.set('view engine', 'pug');

app.use('/static', express.static('public'));

// Homepage
app.get('/', (req, res) => {
    res.render('home');
});

// Product List
app.get('/products', (req, res) => {
    fs.readFile('./data/products.json', (err, data) => {
        if (err) throw err;

        const products = JSON.parse(data);
        res.render('products', { products });
    });
});

// Product Details
app.get('/products/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('./data/products.json', (err, data) => {
        if (err) throw err;

        const products = JSON.parse(data);
        const product = products.find((p) => p.id === id);

        if (product) {
            res.render('product', { product });
        } else {
            res.render('404');
        }
    });
});

// Create Product Form
app.get('/products/create', (req, res) => {
    res.render('create');
});

// Create Product
app.post('/products/create', (req, res) => {
    const { title, description, price } = req.body;

    if (title.trim() === '' || description.trim() === '' || price.trim() === '') {
        res.render('create', { error: true });
    } else {
        fs.readFile('./data/products.json', (err, data) => {
            if (err) throw err;

            const products = JSON.parse(data);
            const newProduct = {
                id: id(),
                title: title,
                description: description,
                price: price,
            };

            products.push(newProduct);

            fs.writeFile('./data/products.json', JSON.stringify(products), (err) => {
                if (err) throw err;

                res.render('create', { success: true });
            });
        });
    }
});

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

app.listen(8000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server is running on port 8000...');
});
