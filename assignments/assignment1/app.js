const http = require('http');
const { usersRoute, rootRoute, createUserRoute } = require('./routes');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    if(req.url === '/users') {
        return usersRoute(req, res);
    }
    if(req.url === '/') {
        return rootRoute(req, res);
    }
    if(req.url === '/create-user' && req.method === 'POST') {
        return createUserRoute(req, res);
    }
    res.statusCode = 404;
    return res.end();
});
server.listen(3000);
