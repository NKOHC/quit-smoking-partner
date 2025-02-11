import { UserGoal } from '../utils/types';

export class GoalService {
    // 创建新目标
    async createGoal(goalData: Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserGoal> {
        const goal: UserGoal = {
            id: Date.now().toString(),
            ...goalData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        localStorage.setItem('goal', JSON.stringify(goal));
        return goal;
    }

    // 获取当前目标
    async getCurrentGoal(): Promise<UserGoal | null> {
        const goalStr = localStorage.getItem('goal');
        return goalStr ? JSON.parse(goalStr) : null;
    }

    // 获取目标进度
    async getGoalProgress(goalId: string): Promise<{
        daysPassed: number;
        daysRemaining: number;
        cigarettesAvoided: number;
        moneySaved: number;
    }> {
        const goal = await this.getCurrentGoal();
        if (!goal) return null;

        const today = new Date();
        const startDate = new Date(goal.startDate);
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
            daysPassed,
            daysRemaining: goal.targetDays - daysPassed,
            cigarettesAvoided: daysPassed * goal.cigaretteInfo.cigarettePerDay,
            moneySaved: (daysPassed * goal.cigaretteInfo.cigarettePerDay * goal.cigaretteInfo.pricePerPack) / 20
        };
    }
} 