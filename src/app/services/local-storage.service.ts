import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly storage = localStorage;

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error getting item ${key} from localStorage`, e);
      return null;
    }
  }

  setItem(key: string, value: unknown) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
