import { Exercise } from '../../../../domain/entities/exercise.entity';
import { ExerciseRepositoryPort } from '../../../../domain/ports/out/exercise-repository.port';
import { ExerciseDocument, ExerciseModel } from './exercise.schema';

export class MongoExerciseRepository implements ExerciseRepositoryPort {
  async findAll(): Promise<Exercise[]> {
    const docs = await ExerciseModel.find().lean<ExerciseDocument[]>();
    return docs.map(this.toDomain);
  }

  async findById(id: string): Promise<Exercise | null> {
    const doc = await ExerciseModel.findById(id).lean<ExerciseDocument | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async save(exercise: Exercise): Promise<Exercise> {
    await ExerciseModel.updateOne(
      { _id: exercise.id },
      {
        _id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: exercise.reps
      },
      { upsert: true }
    );
    return exercise;
  }

  private toDomain(doc: ExerciseDocument): Exercise {
    return new Exercise({
      id: doc._id,
      name: doc.name,
      muscleGroup: doc.muscleGroup,
      sets: doc.sets,
      reps: doc.reps
    });
  }
}
