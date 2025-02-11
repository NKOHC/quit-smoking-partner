import { SmokingUrge } from '../utils/types';

export class UrgeService {
    // 添加新记录
    async addUrgeRecord(record: Omit<SmokingUrge, 'id' | 'createdAt' | 'updatedAt'>): Promise<SmokingUrge> {
        const urge: SmokingUrge = {
            id: Date.now().toString(),
            ...record,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const urges = await this.getUrgeRecords();
        urges.push(urge);
        localStorage.setItem('urges', JSON.stringify(urges));
        
        return urge;
    }

    // 获取记录列表
    async getUrgeRecords(filter?: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<SmokingUrge[]> {
        const urgesStr = localStorage.getItem('urges');
        const urges: SmokingUrge[] = urgesStr ? JSON.parse(urgesStr) : [];

        if (filter?.startDate && filter?.endDate) {
            return urges.filter(urge => {
                const urgeDate = new Date(urge.timestamp);
                return urgeDate >= filter.startDate && urgeDate <= filter.endDate;
            });
        }

        return urges;
    }

    // 更新记录
    async updateUrgeRecord(urge: SmokingUrge): Promise<SmokingUrge> {
        const urges = await this.getUrgeRecords();
        const index = urges.findIndex(u => u.id === urge.id);
        
        if (index > -1) {
            urges[index] = {
                ...urge,
                updatedAt: new Date()
            };
            localStorage.setItem('urges', JSON.stringify(urges));
        }

        return urges[index];
    }
} 