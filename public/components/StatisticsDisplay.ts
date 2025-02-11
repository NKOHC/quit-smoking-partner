// 统计数据展示组件
export class StatisticsDisplay {
    private container: HTMLElement;
    private statisticsService: StatisticsService;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId);
        this.statisticsService = new StatisticsService();
    }

    async render() {
        const stats = await this.statisticsService.calculateOverallStats('1'); // TODO: 从登录状态获取用户ID
        if (!stats) {
            this.container.innerHTML = '<div class="no-data">暂无统计数据</div>';
            return;
        }

        this.container.innerHTML = `
            <div class="stats-container">
                <div class="stats-header">
                    <h3>戒烟数据</h3>
                    <span class="success-rate">成功率 ${stats.successRate.toFixed(1)}%</span>
                </div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-value">${stats.totalUrges}</div>
                        <div class="stat-label">总冲动次数</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${stats.resistedUrges}</div>
                        <div class="stat-label">成功抵抗</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${stats.cigarettesAvoided}</div>
                        <div class="stat-label">已少抽(根)</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">¥${stats.moneySaved.toFixed(2)}</div>
                        <div class="stat-label">已省钱</div>
                    </div>
                </div>
            </div>
        `;

        // TODO: 添加图表展示
    }
} 