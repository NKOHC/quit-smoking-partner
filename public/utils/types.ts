// 用户相关类型定义
export interface User {
    id: string;
    phone: string;
    nickname?: string;
    createdAt: Date;
    updatedAt: Date;
}

// 戒烟目标相关类型定义
export interface UserGoal {
    id: string;
    userId: string;
    startDate: Date;
    targetDays: number;
    cigaretteInfo: {
        pricePerPack: number;
        cigarettePerDay: number;
    };
    status: 'active' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

// 冲动记录相关类型定义
export interface SmokingUrge {
    id: string;
    userId: string;
    timestamp: Date;
    count: number;       // 根数
    intensity: number;   // 1-10的必要性强度
    notes?: string;      // 备注说明
    resisted: boolean;   // 是否成功抵制
    createdAt: Date;
    updatedAt: Date;
}

// 统计数据相关类型定义
export interface QuitProgress {
    userId: string;
    currentStreak: number;     // 当前连续天数
    longestStreak: number;     // 最长连续天数
    totalSmokeFreeHours: number;
    moneySaved: number;
    urgesResisted: number;     // 成功抵抗次数
} 