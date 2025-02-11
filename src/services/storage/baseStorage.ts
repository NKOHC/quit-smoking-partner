// 基础存储服务
export class BaseStorage {
    protected async getItem<T>(key: string): Promise<T | null> {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    protected async setItem(key: string, value: any): Promise<void> {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            throw error;
        }
    }

    protected async removeItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            throw error;
        }
    }
} 