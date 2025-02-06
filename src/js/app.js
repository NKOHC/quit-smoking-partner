class QuitSmokingApp {
    constructor() {
        this.initializeData();
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.loadTips();
        this.checkFirstVisit();
    }

    initializeData() {
        // 从 localStorage 加载数据或使用默认值
        const savedData = JSON.parse(localStorage.getItem('quitSmokingData')) || {};
        this.data = {
            startDate: savedData.startDate || null,
            duration: savedData.duration || 30,
            dailyCount: savedData.dailyCount || 10,
            price: savedData.price || 25,
            urgeRecords: savedData.urgeRecords || [],
            ...savedData
        };
    }

    initializeElements() {
        // 页面元素
        this.pages = {
            progress: document.getElementById('progressPage'),
            goal: document.getElementById('goalPage'),
            profile: document.getElementById('profilePage'),
            history: document.getElementById('historyPage')
        };

        // 导航按钮
        this.navBtns = document.querySelectorAll('.nav-btn');

        // 目标设定表单
        this.goalForm = document.getElementById('goalForm');
        this.startDateInput = document.getElementById('startDate');
        this.durationInput = document.getElementById('duration');
        this.dailyCountInput = document.getElementById('dailyCount');
        this.priceInput = document.getElementById('price');

        // 统计显示
        this.daysPassedElement = document.getElementById('daysPassed');
        this.daysLeftElement = document.getElementById('daysLeft');
        this.moneySavedElement = document.getElementById('moneySaved');
        this.reducedCountElement = document.getElementById('reducedCount');

        // 冲动记录
        this.urgeModal = document.getElementById('urgeModal');
        this.urgeForm = document.getElementById('urgeForm');
        this.urgeTimeInput = document.getElementById('urgeTime');
        this.urgeCountInput = document.getElementById('urgeCount');
        this.urgeNecessityInput = document.getElementById('urgeNecessity');
        this.urgeSceneInput = document.getElementById('urgeScene');
        this.necessityValueElement = document.getElementById('necessityValue');

        // 历史记录
        this.historyList = document.getElementById('historyList');

        // 其他按钮
        this.addUrgeBtn = document.getElementById('addUrgeBtn');
        this.viewHistoryBtn = document.getElementById('viewHistoryBtn');
        this.backBtns = document.querySelectorAll('.back-btn');
        this.closeModalBtn = document.querySelector('.close-btn');

        // 提示容器
        this.tipsContainer = document.getElementById('tipsList');
    }

    setupEventListeners() {
        // 导航切换
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = btn.dataset.page;
                this.switchPage(targetPage);
            });
        });

        // 目标设定表单
        this.goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGoalSettings();
        });

        // 冲动记录相关
        this.addUrgeBtn.addEventListener('click', () => this.openUrgeModal());
        this.closeModalBtn.addEventListener('click', () => this.closeUrgeModal());
        this.urgeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUrgeRecord();
        });
        this.urgeNecessityInput.addEventListener('input', () => {
            this.necessityValueElement.textContent = this.urgeNecessityInput.value;
        });

        // 历史记录
        this.viewHistoryBtn.addEventListener('click', () => {
            this.loadHistoryRecords();
            this.switchPage('historyPage');
        });

        // 返回按钮
        this.backBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchPage('progressPage'));
        });

        // 设置当前时间为默认值
        const now = new Date();
        this.urgeTimeInput.value = now.toISOString().slice(0, 16);
    }

    checkFirstVisit() {
        if (!this.data.startDate) {
            this.switchPage('goalPage');
        }
    }

    switchPage(pageId) {
        // 隐藏所有页面
        Object.values(this.pages).forEach(page => page.classList.add('hidden'));
        
        // 显示目标页面
        this.pages[pageId.replace('Page', '')].classList.remove('hidden');

        // 更新导航按钮状态
        this.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === pageId);
        });
    }

    saveGoalSettings() {
        this.data.startDate = this.startDateInput.value;
        this.data.duration = parseInt(this.durationInput.value);
        this.data.dailyCount = parseInt(this.dailyCountInput.value);
        this.data.price = parseFloat(this.priceInput.value);
        
        this.saveData();
        this.updateDisplay();
        this.showNotification('目标设置已保存！');
        this.switchPage('progressPage');
    }

    openUrgeModal() {
        this.urgeModal.classList.remove('hidden');
        const now = new Date();
        this.urgeTimeInput.value = now.toISOString().slice(0, 16);
    }

    closeUrgeModal() {
        this.urgeModal.classList.add('hidden');
    }

    saveUrgeRecord() {
        const record = {
            time: this.urgeTimeInput.value,
            count: parseInt(this.urgeCountInput.value),
            necessity: parseInt(this.urgeNecessityInput.value),
            scene: this.urgeSceneInput.value,
            timestamp: new Date().getTime()
        };

        this.data.urgeRecords.push(record);
        this.saveData();
        this.updateDisplay();
        this.showNotification('记录已保存！');
        this.closeUrgeModal();
        this.urgeForm.reset();

        // 重置表单默认值
        const now = new Date();
        this.urgeTimeInput.value = now.toISOString().slice(0, 16);
        this.necessityValueElement.textContent = '5';
    }

    loadHistoryRecords() {
        const records = this.data.urgeRecords
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(record => {
                const date = new Date(record.time);
                return `
                    <div class="history-item">
                        <div class="history-time">${date.toLocaleString()}</div>
                        <div class="history-count">数量：${record.count}根</div>
                        <div class="history-necessity">必要性：${record.necessity}/10</div>
                        <div class="history-scene">场景：${record.scene}</div>
                    </div>
                `;
            })
            .join('');

        this.historyList.innerHTML = records || '<p class="empty-history">暂无记录</p>';
    }

    updateDisplay() {
        if (!this.data.startDate) return;

        const startDate = new Date(this.data.startDate);
        const now = new Date();
        const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, this.data.duration - daysPassed);

        // 更新统计数据
        this.daysPassedElement.textContent = Math.max(0, daysPassed);
        this.daysLeftElement.textContent = daysLeft;

        // 计算节省金额
        const cigarettesPerPack = 20;
        const dailySavings = (this.data.dailyCount * this.data.price) / cigarettesPerPack;
        const totalSaved = (dailySavings * daysPassed).toFixed(2);
        this.moneySavedElement.textContent = totalSaved;

        // 计算减少数量
        const reducedCount = this.data.dailyCount * daysPassed;
        this.reducedCountElement.textContent = reducedCount;
    }

    loadTips() {
        const tips = [
            '每支烟只抽一半，逐步减少尼古丁摄入',
            '把打火机放在不容易拿到的地方',
            '尝试用深呼吸代替吸烟的冲动',
            '记录每次想吸烟的场景，找出触发因素',
            '设定小目标，一次只考虑戒烟一天',
            '把省下的烟钱存起来，奖励自己',
            '避开会诱发吸烟欲望的场所和活动',
            '找到替代活动，比如喝水或散步'
        ];

        // 随机选择3条提示显示
        const selectedTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);
        this.tipsContainer.innerHTML = selectedTips.map(tip => `<p>💡 ${tip}</p>`).join('');
    }

    saveData() {
        localStorage.setItem('quitSmokingData', JSON.stringify(this.data));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: var(--border-radius);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new QuitSmokingApp();
}); 