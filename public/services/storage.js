class StorageService {
    constructor() {
        this.db = null;
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('QuitSmokingDB', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 创建用户数据存储
                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'userId' });
                }
                
                // 创建吸烟记录存储
                if (!db.objectStoreNames.contains('urgeRecords')) {
                    const urgeStore = db.createObjectStore('urgeRecords', { keyPath: 'id', autoIncrement: true });
                    urgeStore.createIndex('userId', 'userId', { unique: false });
                    urgeStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async saveUserData(userId, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userData'], 'readwrite');
            const store = transaction.objectStore('userData');
            
            const request = store.put({
                userId,
                ...data,
                lastUpdated: new Date().getTime()
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserData(userId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userData'], 'readonly');
            const store = transaction.objectStore('userData');
            const request = store.get(userId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveUrgeRecord(userId, record) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['urgeRecords'], 'readwrite');
            const store = transaction.objectStore('urgeRecords');
            
            const request = store.add({
                userId,
                ...record,
                timestamp: new Date().getTime(),
                synced: false
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUrgeRecords(userId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['urgeRecords'], 'readonly');
            const store = transaction.objectStore('urgeRecords');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

export default new StorageService(); 