import { GoalService } from './goalService';
import { UrgeService } from './urgeService';

export class StatisticsService {
    private goalService: GoalService;
    private urgeService: UrgeService;

    constructor() {
        this.goalService = new GoalService();
        this.urgeService = new UrgeService();
    }

    // 计算总体统计数据
    async calculateOverallStats(userId: string) {
        const goal = await this.goalService.getCurrentGoal();
        const urges = await this.urgeService.getUrgeRecords();
        
        if (!goal) return null;

        const progress = await this.goalService.getGoalProgress(goal.id);
        const resistedUrges = urges.filter(u => u.resisted).length;

        return {
            ...progress,
            totalUrges: urges.length,
            resistedUrges,
            successRate: urges.length > 0 ? (resistedUrges / urges.length) * 100 : 0
        };
    }

    // 获取每日统计数据
    async getDailyStats(date: Date) {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const urges = await this.urgeService.getUrgeRecords({
            startDate: dayStart,
            endDate: dayEnd
        });

        return {
            date,
            totalUrges: urges.length,
            resistedUrges: urges.filter(u => u.resisted).length,
            averageIntensity: urges.reduce((sum, urge) => sum + urge.intensity, 0) / urges.length || 0
        };
    }
} 