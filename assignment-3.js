const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const myRoutes = require('./routes/asg-3');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(myRoutes);

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);

