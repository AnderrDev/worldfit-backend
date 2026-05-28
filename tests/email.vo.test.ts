import { Email } from '../src/modules/users/domain/value-objects/email.vo';

describe('Email value object', () => {
  it('acepta un email valido y lo normaliza a minusculas', () => {
    const email = Email.create('USER@WORLDFIT.IO');
    expect(email.value).toBe('user@worldfit.io');
  });

  it('rechaza un email invalido', () => {
    expect(() => Email.create('not-an-email')).toThrow(/Email invalido/);
  });
});
