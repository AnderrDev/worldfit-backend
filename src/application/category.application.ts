import { CategoryPort } from '../domain/category.port';
import { Category } from '../domain/entities/category';

export class CategoryApplication {
  private port: CategoryPort;

  constructor(port: CategoryPort) {
    this.port = port;
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<number> {
    return this.port.createCategory(category);
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<boolean> {
    return this.port.updateCategory(id, category);
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.port.deleteCategory(id);
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.port.getCategoryById(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.port.getAllCategories();
  }
}
