// 数据同步服务
import { SyncMetadata } from '../../utils/models';
import { BaseStorage } from '../storage/baseStorage';

export class SyncService extends BaseStorage {
    private readonly SYNC_METADATA_KEY = 'sync_metadata';
    private isSyncing = false;

    constructor(
        private api: any, // TODO: 实现具体的API服务
        private goalStorage: GoalStorage,
        private urgeStorage: UrgeStorage
    ) {
        super();
        this.initializeSync();
    }

    private async initializeSync() {
        const metadata = await this.getSyncMetadata();
        if (!metadata) {
            await this.initializeFirstSync();
        } else {
            await this.performIncrementalSync(metadata);
        }
    }

    private async getSyncMetadata(): Promise<SyncMetadata | null> {
        return await this.getItem<SyncMetadata>(this.SYNC_METADATA_KEY);
    }

    private async initializeFirstSync() {
        const metadata: SyncMetadata = {
            lastSyncTime: new Date(),
            deviceId: this.generateDeviceId(),
            version: 1
        };
        await this.setItem(this.SYNC_METADATA_KEY, metadata);
    }

    private generateDeviceId(): string {
        return 'device_' + Math.random().toString(36).substr(2, 9);
    }

    async syncData(): Promise<void> {
        if (this.isSyncing) return;

        this.isSyncing = true;
        try {
            // 同步目标数据
            const goal = await this.goalStorage.getGoal();
            if (goal) {
                await this.api.syncGoal(goal);
            }

            // 同步冲动记录
            const records = await this.urgeStorage.getUrgeRecords();
            const pendingRecords = records.filter(r => r.syncStatus === 'pending');
            for (const record of pendingRecords) {
                try {
                    await this.api.syncUrgeRecord(record);
                    await this.urgeStorage.updateRecordSyncStatus(record.id, 'synced');
                } catch (error) {
                    await this.urgeStorage.updateRecordSyncStatus(record.id, 'failed');
                }
            }

            // 更新同步元数据
            await this.updateSyncMetadata();
        } finally {
            this.isSyncing = false;
        }
    }

    private async updateSyncMetadata() {
        const metadata = await this.getSyncMetadata();
        if (metadata) {
            await this.setItem(this.SYNC_METADATA_KEY, {
                ...metadata,
                lastSyncTime: new Date(),
                version: metadata.version + 1
            });
        }
    }
} 