import { ExercisePort } from '../domain/exercise.port';
import { CategoryPort } from '../domain/category.port';
import { Exercise } from '../domain/entities/exercise';
import { BusinessError } from '../shared/business-error';

export class ExerciseApplication {
  private port: ExercisePort;
  private categoryPort: CategoryPort;

  constructor(port: ExercisePort, categoryPort: CategoryPort) {
    this.port = port;
    this.categoryPort = categoryPort;
  }

  async createExercise(exercise: Omit<Exercise, 'id'>): Promise<number> {
    const category = await this.categoryPort.getCategoryById(exercise.categoryId);
    if (!category) throw new BusinessError('La categoria indicada no existe o no esta activa', 404);
    return this.port.createExercise(exercise);
  }

  async updateExercise(id: number, exercise: Partial<Exercise>): Promise<boolean> {
    const existing = await this.port.getExerciseById(id);
    if (!existing) throw new BusinessError('Ejercicio no encontrado', 404);

    if (exercise.categoryId != null) {
      const category = await this.categoryPort.getCategoryById(exercise.categoryId);
      if (!category) throw new BusinessError('La categoria indicada no existe o no esta activa', 404);
    }
    return this.port.updateExercise(id, exercise);
  }

  async deleteExercise(id: number): Promise<boolean> {
    const existing = await this.port.getExerciseById(id);
    if (!existing) throw new BusinessError('Ejercicio no encontrado', 404);
    return this.port.deleteExercise(id);
  }

  async getExerciseById(id: number): Promise<Exercise | null> {
    return this.port.getExerciseById(id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.port.getAllExercises();
  }
}
