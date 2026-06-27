import { Request, Response } from 'express';
import { CategoryApplication } from '../../application/category.application';
import { validateCategoryData } from '../util/category-validation';
import { validateCategoryUpdate } from '../util/category-update-validation';
import { handleError, parseId } from '../web/http-response';

export class CategoryController {
  private app: CategoryApplication;

  constructor(app: CategoryApplication) {
    this.app = app;
  }

  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateCategoryData(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const categoryId = await this.app.createCategory(value);
      return res.status(201).json({ message: 'Categoria creada con exito', categoryId });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllCategories(_req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.app.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const category = await this.app.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoria no encontrada' });
      }
      return res.status(200).json(category);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      const { error, value } = validateCategoryUpdate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      await this.app.updateCategory(id, value);
      return res.status(200).json({ message: 'Categoria actualizada correctamente' });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ message: 'ID invalido' });
      }
      await this.app.deleteCategory(id);
      return res.status(200).json({ message: 'Categoria dada de baja' });
    } catch (error) {
      return handleError(res, error);
    }
  }
}
