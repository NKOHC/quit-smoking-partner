// 基础存储服务
export class BaseStorage {
    protected async getItem<T>(key: string): Promise<T | null> {
        try {
            console.log(`[Storage] 读取数据: ${key}`);
            const data = localStorage.getItem(key);
            console.log(`[Storage] 读取结果:`, data);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`[Storage] 读取错误 ${key}:`, error);
            return null;
        }
    }

    protected async setItem(key: string, value: any): Promise<void> {
        try {
            console.log(`[Storage] 保存数据: ${key}`, value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`[Storage] 保存错误 ${key}:`, error);
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