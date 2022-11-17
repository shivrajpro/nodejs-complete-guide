const http = require('http');

const PORT = 3000;
const server = http.createServer((req, res)=>{
    const url = req.url;

    
    if(url === '/'){
        res.setHeader('Content-type','text/html');
        res.write("<html>");
        res.write("<head><title>Assignment 1 solution</title></head>");
        res.write("<body>");
        res.write("<h1>Welcome to Assignment 1</h1>");

        res.write('<form action="/create-user" method="post"> <input type="text" placeholder="enter username" name="username"> <button type="submit">Submit</button> </form>');

        res.write("</body>");
        res.write("</html>");
        return res.end();        
    }

    if(url === '/users'){
        res.setHeader('Content-type','text/html');
        res.write("<html>");
        res.write("<head><title>Assignment 1 solution</title></head>");
        res.write("<body>");

        res.write("<ul> <li>Nodejs User 1</li> <li>Nodejs User 2</li><li>Nodejs User 3</li><li>Nodejs User 4</li> </ul>");

        res.write("</body>");
        res.write("</html>");
        return res.end();        
    }

    if(url === '/create-user' && req.method === 'POST'){
        const body = [];
        req.on('data', (chunk)=>{
            body.push(chunk);
        })

        return req.on('end', ()=>{
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1];
            console.log('username is',username);

            return res.end();
        })
    }
});

server.listen(PORT);