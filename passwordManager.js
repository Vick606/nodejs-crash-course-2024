import crypto from 'crypto';
import readline from 'readline';

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const passwordStore = new Map();

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function addPassword(service, password) {
  const encryptedPassword = encrypt(password);
  passwordStore.set(service, encryptedPassword);
  console.log(`Password for ${service} has been securely stored.`);
}

function getPassword(service) {
  const encryptedPassword = passwordStore.get(service);
  if (encryptedPassword) {
    const decryptedPassword = decrypt(encryptedPassword);
    console.log(`Password for ${service}: ${decryptedPassword}`);
  } else {
    console.log(`No password found for ${service}`);
  }
}

function promptUser() {
  rl.question('Enter command (add/get/quit): ', (command) => {
    switch(command.toLowerCase()) {
      case 'add':
        rl.question('Enter service name: ', (service) => {
          rl.question('Enter password: ', (password) => {
            addPassword(service, password);
            promptUser();
          });
        });
        break;
      case 'get':
        rl.question('Enter service name: ', (service) => {
          getPassword(service);
          promptUser();
        });
        break;
      case 'quit':
        rl.close();
        break;
      default:
        console.log('Invalid command. Please try again.');
        promptUser();
    }
  });
}

console.log('Simple Password Manager');
console.log('Commands: add (add a new password), get (retrieve a password), quit (exit the program)');
promptUser();

rl.on('close', () => {
  console.log('Password manager closed.');
  process.exit(0);
});