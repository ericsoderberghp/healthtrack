const crypto = require('crypto');

const password = 'my-password';

const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.createHmac('sha512', salt);
hash.update(password);
const hashedPassword = hash.digest('hex');
console.log({ salt, hashedPassword });
