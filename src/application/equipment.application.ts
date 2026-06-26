import { EquipmentPort } from '../domain/equipment.port';
import { Equipment } from '../domain/entities/equipment';

export class EquipmentApplication {
  private port: EquipmentPort;

  constructor(port: EquipmentPort) {
    this.port = port;
  }

  async createEquipment(equipment: Omit<Equipment, 'id'>): Promise<number> {
    return this.port.createEquipment(equipment);
  }

  async updateEquipment(id: number, equipment: Partial<Equipment>): Promise<boolean> {
    return this.port.updateEquipment(id, equipment);
  }

  async deleteEquipment(id: number): Promise<boolean> {
    return this.port.deleteEquipment(id);
  }

  async getEquipmentById(id: number): Promise<Equipment | null> {
    return this.port.getEquipmentById(id);
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return this.port.getAllEquipment();
  }
}
