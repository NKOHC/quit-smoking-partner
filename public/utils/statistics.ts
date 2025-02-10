// 统计相关工具函数
export const statistics = {
    // 计算当日冲动次数
    getDayUrges(date: Date): number {
        const urges = storage.getUrges();
        return urges.filter(urge => 
            new Date(urge.timestamp).toDateString() === date.toDateString()
        ).length;
    },

    // 计算省钱金额
    calculateSavedMoney(goal: UserGoal): number {
        if (!goal) return 0;
        
        const start = new Date(goal.startDate);
        const now = new Date();
        const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        const pricePerCigarette = goal.cigaretteInfo.pricePerPack / 20;
        return days * goal.cigaretteInfo.cigarettePerDay * pricePerCigarette;
    },

    // 计算戒烟进度
    getQuitProgress(userId: string): QuitProgress {
        const goal = storage.getGoal();
        const urges = storage.getUrges();
        
        // 计算连续天数等统计数据
        // TODO: 实现具体的统计逻辑
        
        return {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            totalSmokeFreeHours: 0,
            moneySaved: goal ? this.calculateSavedMoney(goal) : 0,
            urgesResisted: urges.filter(u => u.resisted).length
        };
    }
}; 