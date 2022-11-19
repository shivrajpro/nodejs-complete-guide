const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const path = require('path');
const rootDir = require('./util/path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.engine('hbs',  expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// })); //hbs will be the extension of file names
// app.set('view engine', 'hbs');// set the templating engine to be used
// app.set('view engine', 'pug');// set the templating engine to be used
app.set('view engine', 'ejs');
app.set('views', 'views'); //folder in which our templates are kept
app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: 'Page not found'});
});
app.listen(3000); //creates a server on port