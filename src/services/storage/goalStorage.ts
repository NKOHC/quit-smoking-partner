// 目标存储服务
import { BaseStorage } from './baseStorage';
import { UserGoal } from '../../utils/models';

export class GoalStorage extends BaseStorage {
    private readonly GOAL_KEY = 'user_goal';

    async saveGoal(goal: UserGoal): Promise<void> {
        await this.setItem(this.GOAL_KEY, {
            ...goal,
            lastUpdated: new Date()
        });
    }

    async getGoal(): Promise<UserGoal | null> {
        return await this.getItem<UserGoal>(this.GOAL_KEY);
    }

    async updateGoalStatus(status: UserGoal['status']): Promise<void> {
        const goal = await this.getGoal();
        if (goal) {
            await this.saveGoal({
                ...goal,
                status,
                lastUpdated: new Date()
            });
        }
    }
} 