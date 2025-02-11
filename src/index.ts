// 初始化服务和页面组件
import { GoalStorage, UrgeStorage, SyncService } from './services/index';
import { GoalDisplay } from './components/GoalDisplay';
import { UrgeForm } from './components/UrgeForm';
import { StatisticsDisplay } from './components/StatisticsDisplay';
import { runTests } from './utils/test';

document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成');
    
    // 初始化表单事件监听
    const urgeForm = document.getElementById('urgeForm');
    if (urgeForm) {
        urgeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('提交冲动记录表单');
        });
    }
}); 