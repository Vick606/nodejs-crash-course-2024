import { createServer } from 'http';
const PORT = process.env.PORT;

const users = [
    {id: 1, name: 'Jack Sutherland'},
    {id: 2, name: 'Tom Cruise'},
    {id: 3, name: 'Steve Austin'},
    {id: 4, name: 'Roman Reigns'},
    {id: 5, name: 'Spiderman Marvel'},
];

const server = createServer((req, res) => {

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
);