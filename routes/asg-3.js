const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();

router.get('/users', (req, res, next)=>{
    res.sendFile(path.join(rootDir, 'views', 'users.html'));
})
router.get('/',(req, res, next)=>{
    res.sendFile(path.join(rootDir, 'views', 'app.html'));
})

module.exports = router;
