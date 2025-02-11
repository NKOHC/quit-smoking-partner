// 目标展示组件
export class GoalDisplay {
    private container: HTMLElement;
    private goalService: GoalService;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId);
        this.goalService = new GoalService();
    }

    async render() {
        const goal = await this.goalService.getCurrentGoal();
        if (!goal) {
            this.renderEmptyState();
            return;
        }

        const progress = await this.goalService.getGoalProgress(goal.id);
        this.container.innerHTML = `
            <div class="goal-card">
                <div class="progress-circle">
                    <div class="days-count">${progress.daysPassed}</div>
                    <div class="days-label">天</div>
                </div>
                <div class="goal-stats">
                    <div class="stat-item">
                        <div class="stat-value">${progress.cigarettesAvoided}</div>
                        <div class="stat-label">已少抽(根)</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">¥${progress.moneySaved.toFixed(2)}</div>
                        <div class="stat-label">已省钱</div>
                    </div>
                </div>
                <div class="goal-info">
                    <div>目标：${goal.targetDays}天</div>
                    <div>还剩：${progress.daysRemaining}天</div>
                </div>
            </div>
        `;
    }

    private renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-goal">
                <h3>开始您的戒烟计划</h3>
                <button onclick="location.href='goal-setup.html'" class="primary-btn">
                    设置目标
                </button>
            </div>
        `;
    }
} 