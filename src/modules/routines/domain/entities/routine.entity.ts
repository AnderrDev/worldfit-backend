export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface RoutineProps {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  exerciseIds: string[];
  ownerId: string;
  createdAt: Date;
}

export class Routine {
  constructor(private readonly props: RoutineProps) {}

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get difficulty(): Difficulty { return this.props.difficulty; }
  get exerciseIds(): string[] { return [...this.props.exerciseIds]; }
  get ownerId(): string { return this.props.ownerId; }
  get createdAt(): Date { return this.props.createdAt; }

  toPlain() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      difficulty: this.difficulty,
      exerciseIds: this.exerciseIds,
      ownerId: this.ownerId,
      createdAt: this.createdAt.toISOString()
    };
  }
}
