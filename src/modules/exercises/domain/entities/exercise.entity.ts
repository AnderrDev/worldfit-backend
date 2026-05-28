export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'fullbody';

export interface ExerciseProps {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
}

export class Exercise {
  constructor(private readonly props: ExerciseProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get muscleGroup(): MuscleGroup { return this.props.muscleGroup; }
  get sets(): number { return this.props.sets; }
  get reps(): number { return this.props.reps; }

  toPlain() {
    return {
      id: this.id,
      name: this.name,
      muscleGroup: this.muscleGroup,
      sets: this.sets,
      reps: this.reps
    };
  }
}
