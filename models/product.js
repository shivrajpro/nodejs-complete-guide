// const products = [];
const path = require('path');
const fs = require('fs');
module.exports = class Product{
    constructor(t){
        this.title = t;
    }

    save(){
        const p = path.join(
            path.dirname(require.main.filename),
            'data',
            'products.json'
        );

        fs.readFile(p, (err, fileContent)=>{
            let products = [];

            if(!err && fileContent){
                products = JSON.parse(fileContent);
            }
            products.push(this);

            fs.writeFile(p, JSON.stringify(products), err=>{
                console.log(err);
            })
        })
    }

    static fetchAll(cb){
        // return products;
        const p = path.join(
            path.dirname(require.main.filename),
            'data',
            'products.json'
        );

        fs.readFile(p, (err, fileContent)=>{
            if(err) return cb([]);
            return cb(JSON.parse(fileContent));
        })
    }
}