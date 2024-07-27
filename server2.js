import { createServer } from 'http';
const PORT = process.env.PORT;

const users = [
    {id: 1, name: 'Jack Sutherland'},
    {id: 2, name: 'Tom Cruise'},
    {id: 3, name: 'Steve Austin'},
    {id: 4, name: 'Roman Reigns'},
    {id: 5, name: 'Spiderman Marvel'},
];

// Logger Middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

// JSON Middleware
const jsonMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
};

// Route handler for GET /api/users
const getUsersHandler = (req, res) => {
    res.write(JSON.stringify(users));
    res.end();
};

// Route handler for GET /api/users/:id
const getUserByIdHandler = (req, res) => {
    const id = req.url.split('/')[3];
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
        res.write(JSON.stringify(user));
    } else {
        res.statusCode = 404;
        res.write(JSON.stringify({ message: 'User not found' }));
    }
    res.end();
}

// Not found handler
const notFoundHandler = (req, res) => {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: 'Route not found' }));
    res.end();

}

const server = createServer((req, res) => {
    logger(req, res, () => {
        jsonMiddleware(req, res, () => {
            if (req.url === '/api/users' && req.method === 'GET') {
                getUsersHandler();
            } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'GET') {
                getUserByIdHandler();
            } else {
                notFoundHandler();
            }
    })
});
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
);