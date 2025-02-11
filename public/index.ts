// 初始化服务和页面组件
import { GoalStorage, UrgeStorage, SyncService } from './services/index';
import { GoalDisplay } from './components/GoalDisplay';
import { UrgeForm } from './components/UrgeForm';
import { StatisticsDisplay } from './components/StatisticsDisplay';
import { runTests } from './utils/test';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 在开发环境运行测试
        if (process.env.NODE_ENV !== 'production') {
            await runTests();
        }

        // 初始化存储服务
        const goalStorage = new GoalStorage();
        const urgeStorage = new UrgeStorage();
        
        // 初始化同步服务
        const syncService = new SyncService(
            null, // TODO: 添加API服务
            goalStorage,
            urgeStorage
        );

        // 初始化页面组件
        const goalDisplay = new GoalDisplay('goalContainer', goalStorage);
        const urgeForm = new UrgeForm('urgeForm', urgeStorage, syncService);
        const statsDisplay = new StatisticsDisplay('statsContainer', goalStorage, urgeStorage);

        // 渲染页面
        await goalDisplay.render();
        await statsDisplay.render();

        console.log('页面初始化完成');

        // 定期同步数据
        setInterval(() => {
            syncService.syncData();
        }, 5 * 60 * 1000); // 每5分钟同步一次
    } catch (error) {
        console.error('页面初始化失败:', error);
    }
}); 