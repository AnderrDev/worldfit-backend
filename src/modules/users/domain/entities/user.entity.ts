import { Email } from '../value-objects/email.vo';

export interface UserProps {
  id: string;
  email: Email;
  fullName: string;
  passwordHash: string;
  createdAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string { return this.props.id; }
  get email(): Email { return this.props.email; }
  get fullName(): string { return this.props.fullName; }
  get passwordHash(): string { return this.props.passwordHash; }
  get createdAt(): Date { return this.props.createdAt; }

  toPlain() {
    return {
      id: this.id,
      email: this.email.value,
      fullName: this.fullName,
      createdAt: this.createdAt.toISOString()
    };
  }
}
