import { Routine } from '../../../../domain/entities/routine.entity';
import { RoutineRepositoryPort } from '../../../../domain/ports/out/routine-repository.port';
import { RoutineDocument, RoutineModel } from './routine.schema';

export class MongoRoutineRepository implements RoutineRepositoryPort {
  async findAll(): Promise<Routine[]> {
    const docs = await RoutineModel.find().lean<RoutineDocument[]>();
    return docs.map(this.toDomain);
  }

  async findById(id: string): Promise<Routine | null> {
    const doc = await RoutineModel.findById(id).lean<RoutineDocument | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async save(routine: Routine): Promise<Routine> {
    await RoutineModel.updateOne(
      { _id: routine.id },
      {
        _id: routine.id,
        name: routine.name,
        description: routine.description,
        difficulty: routine.difficulty,
        exerciseIds: routine.exerciseIds,
        ownerId: routine.ownerId,
        createdAt: routine.createdAt
      },
      { upsert: true }
    );
    return routine;
  }

  async delete(id: string): Promise<void> {
    await RoutineModel.deleteOne({ _id: id });
  }

  private toDomain(doc: RoutineDocument): Routine {
    return new Routine({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      difficulty: doc.difficulty,
      exerciseIds: doc.exerciseIds,
      ownerId: doc.ownerId,
      createdAt: doc.createdAt
    });
  }
}
