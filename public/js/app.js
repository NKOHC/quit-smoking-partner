class QuitSmokingApp {
    constructor() {
        this.initializeServices();
        this.initializeElements();
        this.setupEventListeners();
        this.checkFirstVisit();
    }

    async initializeServices() {
        this.storage = await import('../services/storage.js');
        this.auth = await import('../services/auth.js');
        this.loadUserData();
    }

    initializeElements() {
        // 状态卡片元素
        this.daysPassedElement = document.getElementById('daysPassed');
        this.daysLeftElement = document.getElementById('daysLeft');
        this.startDateDisplay = document.getElementById('startDateDisplay');
        
        // 统计数据元素
        this.reducedCountElement = document.getElementById('reducedCount');
        this.moneySavedElement = document.getElementById('moneySaved');
        
        // 按钮和导航元素
        this.editBtn = document.getElementById('editBtn');
        this.addUrgeBtn = document.getElementById('addUrgeBtn');
        this.viewHistoryBtn = document.getElementById('viewHistoryBtn');
        this.navBtns = document.querySelectorAll('.nav-btn');
        
        // 页面容器
        this.pages = {
            progress: document.getElementById('progressPage'),
            profile: document.getElementById('profilePage'),
            history: document.getElementById('historyPage')
        };

        // 模态框元素
        this.urgeModal = document.getElementById('urgeModal');
        this.closeModalBtn = document.querySelector('.close-btn');
        this.urgeForm = document.getElementById('urgeForm');
    }

    setupEventListeners() {
        // 编辑按钮
        this.editBtn.addEventListener('click', () => this.showEditModal());
        
        // 记录冲动按钮
        this.addUrgeBtn.addEventListener('click', () => this.showUrgeModal());
        
        // 查看历史
        this.viewHistoryBtn.addEventListener('click', () => {
            this.loadHistoryRecords();
            this.switchPage('history');
        });
        
        // 导航切换
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = btn.dataset.page.replace('Page', '');
                this.switchPage(targetPage);
            });
        });

        // 模态框关闭
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
        
        // 冲动记录表单提交
        this.urgeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUrgeRecord();
        });
    }

    async loadUserData() {
        const userId = this.auth.currentUser?.id || 'anonymous';
        const userData = await this.storage.getUserData(userId);
        if (userData) {
            this.data = userData;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        if (!this.data?.startDate) return;

        const startDate = new Date(this.data.startDate);
        const now = new Date();
        const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, this.data.duration - daysPassed);

        // 更新状态卡片
        this.daysPassedElement.textContent = Math.max(0, daysPassed);
        this.daysLeftElement.textContent = daysLeft;
        this.startDateDisplay.textContent = startDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 更新统计数据
        const reducedCount = this.data.dailyCount * daysPassed;
        this.reducedCountElement.textContent = reducedCount;

        const cigarettesPerPack = 20;
        const dailySavings = (this.data.dailyCount * this.data.price) / cigarettesPerPack;
        const totalSaved = (dailySavings * daysPassed).toFixed(2);
        this.moneySavedElement.textContent = totalSaved;
    }

    switchPage(pageName) {
        Object.values(this.pages).forEach(page => page.classList.add('hidden'));
        this.pages[pageName].classList.remove('hidden');
        
        // 更新导航按钮状态
        this.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === `${pageName}Page`);
        });
    }

    showModal(modalElement) {
        modalElement.classList.remove('hidden');
    }

    hideModal() {
        this.urgeModal.classList.add('hidden');
    }

    showUrgeModal() {
        const now = new Date();
        document.getElementById('urgeTime').value = now.toISOString().slice(0, 16);
        this.showModal(this.urgeModal);
    }

    async saveUrgeRecord() {
        const record = {
            time: document.getElementById('urgeTime').value,
            count: parseInt(document.getElementById('urgeCount').value),
            necessity: parseInt(document.getElementById('urgeNecessity').value),
            scene: document.getElementById('urgeScene').value
        };

        const userId = this.auth.currentUser?.id || 'anonymous';
        await this.storage.saveUrgeRecord(userId, record);
        this.hideModal();
        this.showNotification('记录已保存');
        this.urgeForm.reset();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    checkFirstVisit() {
        if (!this.data?.startDate) {
            this.showEditModal();
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new QuitSmokingApp();
}); 