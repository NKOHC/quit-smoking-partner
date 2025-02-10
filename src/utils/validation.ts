// 数据验证相关工具函数
export const validation = {
    // 目标设置验证
    goalValidation: {
        targetDays: {
            min: 1,
            max: 365,
            validate: (days: number) => days >= 1 && days <= 365
        },
        cigarettePerDay: {
            min: 1,
            max: 100,
            validate: (count: number) => count >= 1 && count <= 100
        },
        pricePerPack: {
            min: 0,
            max: 1000,
            validate: (price: number) => price >= 0 && price <= 1000
        }
    },

    // 冲动记录验证
    urgeValidation: {
        intensity: {
            min: 1,
            max: 10,
            validate: (intensity: number) => intensity >= 1 && intensity <= 10
        },
        notes: {
            maxLength: 500,
            validate: (notes?: string) => !notes || notes.length <= 500
        }
    }
}; 