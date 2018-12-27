import hash from 'hash.js';
import { ACCESS_TOKEN } from './config';

export { validate, generateToken };

/**
 *
 * @param {string} token
 * @param {string[]} [signUpTokens]
 * @returns {boolean}
 */
function validate(token, signUpTokens) {
  if (signUpTokens && signUpTokens.includes(token)) {
    return true;
  }

  return ACCESS_TOKEN === token;
}

/**
 *
 * @param {string} login
 * @param {string} password
 * @returns {string} token
 */
function generateToken(login, password) {
  return hash.sha256().update(`${login}+${password}`).digest('hex');
}
