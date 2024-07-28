import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

function greetHandler(name) {
    console.log('Hello ' + name);
}

function goodbyeHandler(name) {
    console.log('Goodbye, see you soon ', + name);
}

// Register event listeners
myEmitter.on('greet', greetHandler);
myEmitter.on('goodbye', goodbyeHandler);

// Emit events 
myEmitter.emit('greet', 'Vick');
myEmitter.emit('goodbye', 'Vick');