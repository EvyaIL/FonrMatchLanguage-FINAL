const crypto = require('crypto');

// Generate a random string of 64 hexadecimal characters
const token = crypto.randomBytes(32).toString('hex');

console.log('JWT_SECRET for your .env file:');
console.log(token);
