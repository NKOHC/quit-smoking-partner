// 冲动记录存储服务
import { BaseStorage } from './baseStorage';
import { UrgeRecord } from '../../utils/models';

export class UrgeStorage extends BaseStorage {
    private readonly URGE_RECORDS_KEY = 'urge_records';

    async saveUrgeRecord(record: UrgeRecord): Promise<void> {
        const records = await this.getUrgeRecords();
        records.push({
            ...record,
            syncStatus: 'pending'
        });
        await this.setItem(this.URGE_RECORDS_KEY, records);
    }

    async getUrgeRecords(): Promise<UrgeRecord[]> {
        return await this.getItem<UrgeRecord[]>(this.URGE_RECORDS_KEY) || [];
    }

    async updateRecordSyncStatus(
        recordId: string, 
        status: UrgeRecord['syncStatus']
    ): Promise<void> {
        const records = await this.getUrgeRecords();
        const index = records.findIndex(r => r.id === recordId);
        if (index > -1) {
            records[index].syncStatus = status;
            await this.setItem(this.URGE_RECORDS_KEY, records);
        }
    }
} 