import { User } from '../../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../../domain/ports/out/user-repository.port';
import { Email } from '../../../../domain/value-objects/email.vo';
import { UserDocument, UserModel } from './user.schema';

/**
 * Adaptador de salida: implementa UserRepositoryPort contra MongoDB.
 */
export class MongoUserRepository implements UserRepositoryPort {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean<UserDocument | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
      .lean<UserDocument | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async save(user: User): Promise<User> {
    await UserModel.updateOne(
      { _id: user.id },
      {
        _id: user.id,
        email: user.email.value,
        fullName: user.fullName,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt
      },
      { upsert: true }
    );
    return user;
  }

  private toDomain(doc: UserDocument): User {
    return new User({
      id: doc._id,
      email: Email.create(doc.email),
      fullName: doc.fullName,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt
    });
  }
}
