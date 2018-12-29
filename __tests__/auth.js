import { validate, generateToken } from '../src/js/auth';
import { ACCESS_TOKEN } from '../src/js/config';

describe('auth', () => {
  test('generateToken', () => {
    const token1 = generateToken('test', 'demo');
    const token2 = generateToken('abc', 'def');

    expect(token1).toBe('5b476abb24d291d327431d166909cebafdd7abf455db81c976a17306df366c59');
    expect(token2).toBe('03fb0f371984c4f96767a3ffc783204524b07926d6293d950a548a01c4871583');
  });

  test('validate', () => {
    expect(validate(ACCESS_TOKEN)).toBeTruthy();

    const token = generateToken('test', 'demo');
    const validTokens = [
      '5b476abb24d291d327431d166909cebafdd7abf455db81c976a17306df366c59',
      '03fb0f371984c4f96767a3ffc783204524b07926d6293d950a548a01c4871583',
    ];

    expect(validate(token)).toBeFalsy();
    expect(validate(token, validTokens)).toBeTruthy();
  });
});
