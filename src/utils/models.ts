// 核心数据模型定义
export interface UserGoal {
    id: string;
    startDate: Date;
    targetDays: number;
    cigarettesPerDay: number;
    pricePerPack: number;
    status: 'active' | 'completed' | 'failed';
    lastUpdated: Date;
}

export interface UrgeRecord {
    id: string;
    timestamp: Date;
    intensity: number; // 1-10
    mood: string;
    notes?: string;
    isResisted: boolean;
    syncStatus: 'pending' | 'synced' | 'failed';
}

export interface SyncMetadata {
    lastSyncTime: Date;
    deviceId: string;
    version: number;
} 