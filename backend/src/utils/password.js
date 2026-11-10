const bcrypt = require('bcryptjs');

const ROUNDS = 12;

function hashPassword(plain) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, ROUNDS, (error, hash) => (error ? reject(error) : resolve(hash)));
  });
}

function verifyPassword(plain, hash) {
  return new Promise((resolve, reject) => {
    if (!hash) return resolve(false);
    bcrypt.compare(plain, hash, (error, matches) => (error ? reject(error) : resolve(matches)));
  });
}

module.exports = { hashPassword, verifyPassword, ROUNDS };
