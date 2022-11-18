const fs = require('fs');
const requestHandler = (req, res)=>{
    const url =  req.url;
    if(url === '/'){
        res.write("<html>");
        res.write("<head><title>My first app</title></head>");
        res.write('<form action="/message" method="post"> <input type="text" placeholder="enter text" name="someText"> <button type="submit">Send</button> </form>');
        res.write("</html>");
    
        return res.end();
    }
    
    if(url === '/message' && req.method === 'POST' ){
        const body = [];
    
        req.on('data', (chunk)=>{
            // console.log('chunk=',chunk);
            body.push(chunk);
        })
    
        return req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString();
            console.log("parsedbody=",parsedBody);
            const message = parsedBody.split("=")[1];
            
            //by using sync we block execution of next line of code            
            // fs.writeFileSync("message.txt", message);
            // below function is async, meaning next lines of code will execute
            // irrespective of whether the file operation is complete
            fs.writeFile("message.txt", message, err=>{
                res.statusCode = 302;
                res.setHeader('Location','/');
                
                return res.end();
            });
        })
    }
    res.setHeader('Content-type','text/html');
    res.write("<html>");
    res.write("<head><title>My first app</title></head>");
    res.write("<body><h1>Hello from Nodejs server!</h1></body>");
    res.write("</html>");
    res.end();
}

// module.exports = requestHandler;
// module.exports = {
//     reqHandler: requestHandler,
//     someTextt: 'hello there, from routes.js'
// }

// module.exports.reqHandler = requestHandler;
// module.exports.someText = 'hello there, from routes.js';

exports.reqHandler = requestHandler;
exports.someText = 'hello there, from routes.js';

// DOEST NOT WORK
// exports = {
//   reqHandler: requestHandler,
//   someTextt: "hello there, from routes.js",
// };
