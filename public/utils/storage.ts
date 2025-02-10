// 本地存储相关工具函数
export const storage = {
    // 用户相关
    setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    clearUser() {
        localStorage.removeItem('user');
    },

    // 戒烟目标相关
    setGoal(goal: UserGoal) {
        localStorage.setItem('goal', JSON.stringify(goal));
    },
    getGoal(): UserGoal | null {
        const goal = localStorage.getItem('goal');
        return goal ? JSON.parse(goal) : null;
    },

    // 冲动记录相关
    getUrges(): SmokingUrge[] {
        const urges = localStorage.getItem('urges');
        return urges ? JSON.parse(urges) : [];
    },
    addUrge(urge: SmokingUrge) {
        const urges = this.getUrges();
        urges.push(urge);
        localStorage.setItem('urges', JSON.stringify(urges));
    },
    updateUrge(urge: SmokingUrge) {
        const urges = this.getUrges();
        const index = urges.findIndex(u => u.id === urge.id);
        if (index > -1) {
            urges[index] = urge;
            localStorage.setItem('urges', JSON.stringify(urges));
        }
    }
}; 