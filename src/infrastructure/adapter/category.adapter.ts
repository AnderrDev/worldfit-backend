import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Category as CategoryEntity } from '../entities/Category';
import { Category as CategoryDomain } from '../../domain/entities/category';
import { CategoryPort } from '../../domain/category.port';

export class CategoryAdapter implements CategoryPort {
  private categoryRepository: Repository<CategoryEntity>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(CategoryEntity);
  }

  private toDomain(category: CategoryEntity): CategoryDomain {
    return {
      id: category.id_category,
      name: category.name_category,
      description: category.description,
      isActive: category.is_active,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  }

  private toEntity(category: Omit<CategoryDomain, 'id'>): CategoryEntity {
    const entity = new CategoryEntity();
    entity.name_category = category.name;
    entity.description = category.description ?? '';
    entity.is_active = category.isActive ?? true;
    return entity;
  }

  async createCategory(category: Omit<CategoryDomain, 'id'>): Promise<number> {
    try {
      const saved = await this.categoryRepository.save(this.toEntity(category));
      return saved.id_category;
    } catch (error) {
      throw new Error('Error al crear la categoria');
    }
  }

  async updateCategory(id: number, category: Partial<CategoryDomain>): Promise<boolean> {
    try {
      const existing = await this.categoryRepository.findOne({ where: { id_category: id } });
      if (!existing) return false;
      if (category.name != null) existing.name_category = category.name;
      if (category.description != null) existing.description = category.description;
      if (category.isActive != null) existing.is_active = category.isActive;
      await this.categoryRepository.save(existing);
      return true;
    } catch (error) {
      throw new Error('Error al actualizar la categoria');
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const result = await this.categoryRepository.softDelete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      throw new Error('Error al eliminar la categoria');
    }
  }

  async getCategoryById(id: number): Promise<CategoryDomain | null> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id_category: id, is_active: true } });
      return category ? this.toDomain(category) : null;
    } catch (error) {
      throw new Error('Error al obtener la categoria');
    }
  }

  async getCategoryByName(name: string): Promise<CategoryDomain | null> {
    try {
      const category = await this.categoryRepository.findOne({ where: { name_category: name, is_active: true } });
      return category ? this.toDomain(category) : null;
    } catch (error) {
      throw new Error('Error al obtener la categoria');
    }
  }

  async getAllCategories(): Promise<CategoryDomain[]> {
    try {
      const categories = await this.categoryRepository.find({ where: { is_active: true } });
      return categories.map((c) => this.toDomain(c));
    } catch (error) {
      throw new Error('Error al obtener las categorias');
    }
  }
}
