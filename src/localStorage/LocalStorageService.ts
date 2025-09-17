/**
 * Servicio genérico para manejar operaciones CRUD en localStorage
 * Simula el comportamiento de una API para facilitar la transición futura
 */
export class LocalStorageService<T extends Record<string, unknown>> {
  private storageKey: string;
  private idField: string;

  constructor(storageKey: string, idField: string = 'id') {
    this.storageKey = storageKey;
    this.idField = idField;
  }

  /**
   * Obtiene todos los elementos del localStorage
   */
  async getAll(): Promise<T[]> {
    return new Promise((resolve) => {
      const data = localStorage.getItem(this.storageKey);
      const items = data ? JSON.parse(data) : [];
      resolve(items);
    });
  }

  /**
   * Obtiene un elemento por ID
   */
  async getById(id: number): Promise<T | null> {
    return new Promise((resolve) => {
      const items = this.getAllSync();
      const item = items.find(item => item[this.idField] === id);
      resolve(item || null);
    });
  }

  /**
   * Crea un nuevo elemento
   */
  async create(item: Omit<T, typeof this.idField>): Promise<T> {
    return new Promise((resolve) => {
      const items = this.getAllSync();
      const newId = this.getNextId(items);
      const newItem = { ...item, [this.idField]: newId } as T;
      
      items.push(newItem);
      this.saveToStorage(items);
      resolve(newItem);
    });
  }

  /**
   * Actualiza un elemento existente
   */
  async update(item: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const items = this.getAllSync();
      const index = items.findIndex(i => i[this.idField] === item[this.idField]);
      
      if (index === -1) {
        reject(new Error(`Item with ${this.idField} ${item[this.idField]} not found`));
        return;
      }
      
      items[index] = item;
      this.saveToStorage(items);
      resolve(item);
    });
  }

  /**
   * Elimina un elemento por ID
   */
  async delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const items = this.getAllSync();
      const index = items.findIndex(item => item[this.idField] === id);
      
      if (index === -1) {
        reject(new Error(`Item with ${this.idField} ${id} not found`));
        return;
      }
      
      items.splice(index, 1);
      this.saveToStorage(items);
      resolve();
    });
  }

  /**
   * Inicializa el localStorage con datos por defecto si está vacío
   */
  initializeWithDefaults(defaultData: T[]): void {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      this.saveToStorage(defaultData);
    }
  }

  /**
   * Limpia todos los datos del localStorage para esta entidad
   */
  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Métodos privados auxiliares
  private getAllSync(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private getNextId(items: T[]): number {
    if (items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => {
      const id = item[this.idField];
      return typeof id === 'number' ? id : 0;
    }));
    return maxId + 1;
  }
}