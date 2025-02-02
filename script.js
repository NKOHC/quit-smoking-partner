class QuitSmokingTracker {
    constructor(userIndex) {
        this.userIndex = userIndex;
        this.startTime = null;
        this.currentMood = null;
        this.longestStreak = 0;
        this.loadData();
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        const userCard = document.querySelectorAll('.user-card')[this.userIndex];
        this.timerElements = {
            days: userCard.querySelector('.days'),
            hours: userCard.querySelector('.hours'),
            minutes: userCard.querySelector('.minutes')
        };
        this.progressBar = userCard.querySelector('.progress');
        this.moodButtons = userCard.querySelectorAll('.mood');
        this.cheerButton = userCard.querySelector('.cheer-button');
        this.resetButton = userCard.querySelector('.reset-button');
    }

    setupEventListeners() {
        this.moodButtons.forEach(button => {
            button.addEventListener('click', () => this.setMood(button.dataset.mood));
        });

        this.cheerButton.addEventListener('click', () => this.cheer());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.startTime) {
            this.startTime = new Date().getTime();
            this.saveData();
            this.updateDisplay();
        }
    }

    reset() {
        const currentStreak = this.calculateStreak();
        if (currentStreak > this.longestStreak) {
            this.longestStreak = currentStreak;
        }
        this.startTime = new Date().getTime();
        this.saveData();
        this.updateDisplay();
    }

    calculateStreak() {
        if (!this.startTime) return 0;
        const now = new Date().getTime();
        return Math.floor((now - this.startTime) / (1000 * 60 * 60 * 24));
    }

    updateDisplay() {
        if (!this.startTime) return;

        const now = new Date().getTime();
        const diff = now - this.startTime;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        this.timerElements.days.textContent = days;
        this.timerElements.hours.textContent = hours;
        this.timerElements.minutes.textContent = minutes;

        // 更新进度条（假设30天为一个周期）
        const progress = Math.min((days / 30) * 100, 100);
        this.progressBar.style.width = `${progress}%`;

        this.checkMilestones(days);
    }

    setMood(mood) {
        this.currentMood = mood;
        this.moodButtons.forEach(button => {
            button.style.opacity = button.dataset.mood === mood ? '1' : '0.5';
        });
        this.saveData();
    }

    cheer() {
        const cheerButton = this.cheerButton;
        cheerButton.textContent = '加油！💪';
        cheerButton.disabled = true;
        setTimeout(() => {
            cheerButton.textContent = '为Ta加油';
            cheerButton.disabled = false;
        }, 2000);
    }

    checkMilestones(days) {
        const milestones = {
            1: '恭喜坚持1天！',
            3: '太棒了！已经3天了！',
            7: '一周里程碑达成！',
            14: '两周！继续加油！',
            30: '一个月！你太厉害了！',
            60: '两个月！无人能挡！',
            90: '三个月！你是戒烟大师！'
        };

        if (milestones[days]) {
            this.showMilestone(milestones[days]);
        }
    }

    showMilestone(message) {
        const milestoneList = document.getElementById('milestone-list');
        const milestone = document.createElement('li');
        milestone.textContent = message;
        milestoneList.insertBefore(milestone, milestoneList.firstChild);
    }

    saveData() {
        const data = {
            startTime: this.startTime,
            currentMood: this.currentMood,
            longestStreak: this.longestStreak
        };
        localStorage.setItem(`user${this.userIndex}`, JSON.stringify(data));
    }

    loadData() {
        const data = JSON.parse(localStorage.getItem(`user${this.userIndex}`));
        if (data) {
            this.startTime = data.startTime;
            this.currentMood = data.currentMood;
            this.longestStreak = data.longestStreak;
        }
    }
}

// 初始化两个用户的戒烟追踪器
const user1 = new QuitSmokingTracker(0);
const user2 = new QuitSmokingTracker(1);

// 启动计时器
user1.start();
user2.start();

// 定期更新显示
setInterval(() => {
    user1.updateDisplay();
    user2.updateDisplay();
}, 60000); // 每分钟更新一次 