import http from 'http';
const PORT = 8000;

const server = http.createServer((req, res) => {
    res.end('Hello World, coding in session');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
);