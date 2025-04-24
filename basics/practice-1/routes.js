const { addUser, getUsers } = require("./state");

const usersRoute = (_, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Users</title></head>');
    res.write(`<body><ul>${getUsers().map(u => `<li>${u}</li>`).join('')}</ul></body>`);
    res.write('</html>');
    return res.end();
};
const rootRoute = (_, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Enter user</title></head>');
    res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
};
const createUserRoute = (req, res) => {
    const body = [];
    req.on('data', chunk => body.push(chunk));
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const user = parsedBody.split('=')[1];
        console.log(user);
        addUser(user);
        res.statusCode = 302;
        res.setHeader('Location', '/users');
        return res.end();
    });
};

module.exports = {
    usersRoute,
    rootRoute,
    createUserRoute
}
