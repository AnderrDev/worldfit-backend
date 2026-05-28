import { ValidationError } from '@shared/domain/errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    if (!EMAIL_REGEX.test(value)) {
      throw new ValidationError(`Email invalido: ${value}`);
    }
    return new Email(value.toLowerCase());
  }
}
