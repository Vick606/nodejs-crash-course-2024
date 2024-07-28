import { createServer } from 'http';
import url from 'url';

const PORT = process.env.PORT || 3000;

let users = [
    {id: 1, name: 'Jack Sutherland', email: 'jack@example.com'},
    {id: 2, name: 'Tom Cruise', email: 'tom@example.com'},
    {id: 3, name: 'Steve Austin', email: 'steve@example.com'},
    {id: 4, name: 'Roman Reigns', email: 'roman@example.com'},
    {id: 5, name: 'Spiderman Marvel', email: 'spidey@example.com'},
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

// Basic Auth Middleware
const basicAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end(JSON.stringify({ message: 'Missing Authorization Header' }));
        return;
    }

    const base64Credentials =  auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === 'admin' && password === 'password') {
        next();
    } else {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end(JSON.stringify({ message: 'Invalid Authentication Credentials' }));
    }
};

// Helper function to parse body
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
};

// Route Handlers
const getUsersHandler = (req, res) => {
    const { query } = url.parse(req.url, true);
    let filteredUsers = [...users];
    
    if (query.name) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(query.name.toLowerCase())
        );
    }

    res.end(JSON.stringify(filteredUsers));
};

const getUserByIdHandler = (req, res) => {
    const id = req.url.split('/')[3];
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
        res.end(JSON.stringify(user));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'User not found' }));
    }
};

const createUserHandler = async (req, res) => {
    try {
        const newUser = await parseBody(req);
        newUser.id = users.length + 1;
        users.push(newUser);
        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
    } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid user data' }));
    }
};

const updateUserHandler = async (req, res) => {
    const id = parseInt(req.url.split('/')[3]);
    try {
        const updatedData = await parseBody(req);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            res.end(JSON.stringify(users[userIndex]));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid user data' }));
    }
};

const deleteUserHandler = (req, res) => {
    const id = parseInt(req.url.split('/')[3]);
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    if (users.length < initialLength) {
        res.statusCode = 204;
        res.end();
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'User not found' }));
    }
};

const notFoundHandler = (req, res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
};

const server = createServer((req, res) => {
    logger(req, res, () => {
        jsonMiddleware(req, res, () => {
            basicAuth(req, res, () => {
                if (req.url.startsWith('/api/users') && req.method === 'GET') {
                    if (req.url === '/api/users') {
                        getUsersHandler(req, res);
                    } else if (req.url.match(/\/api\/users\/([0-9]+)/)) {
                        getUserByIdHandler(req, res);
                    }
                } else if (req.url === '/api/users' && req.method === 'POST') {
                    createUserHandler(req, res);
                } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'PUT') {
                    updateUserHandler(req, res);
                } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'DELETE') {
                    deleteUserHandler(req, res);
                } else {
                    notFoundHandler(req, res);
                }
            });
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});