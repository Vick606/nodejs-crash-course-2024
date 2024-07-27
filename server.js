import http from 'http';
const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
    // res.setHeader('Content-Type', 'text/html');
    // res.statusCode = 404;

    res.writeHead(200, { 'Content-Type': 'text/html'});
    res.end('<h1>Hello World, Node course in session<h1/>');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
);