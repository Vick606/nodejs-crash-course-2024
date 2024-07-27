import crypto from 'crypto';

// createHash()
const hash = crypto.createHash('sha256');
hash.update('password12345');
console.log(hash.digest('hex'));

// randomBytes()
crypto.randomBytes(16, (err, buf) => {
    if (err) throw err;
    console.log(buf.toString('hex'));
});

// createCipheriv & createDecipheriv
const algorithm = 'aes-s256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Helo, this is a secrete message', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);