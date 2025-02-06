class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.checkAuthState();
    }

    async checkAuthState() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const response = await this.verifyToken(token);
                this.setAuthState(response.user);
            } catch (error) {
                this.clearAuthState();
            }
        }
    }

    async loginWithWechat() {
        // 这里需要集成微信登录 SDK
        // 示例代码，实际需要根据微信文档实现
        try {
            const code = await this.getWechatCode();
            const response = await fetch('/api/auth/wechat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            
            const data = await response.json();
            if (data.token) {
                this.setAuthState(data.user, data.token);
                return data.user;
            }
        } catch (error) {
            throw new Error('微信登录失败');
        }
    }

    setAuthState(user, token = null) {
        this.currentUser = user;
        this.isAuthenticated = true;
        if (token) {
            localStorage.setItem('auth_token', token);
        }
    }

    clearAuthState() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('auth_token');
    }

    async logout() {
        this.clearAuthState();
        // 可以添加其他清理逻辑
    }

    async verifyToken(token) {
        // 实际需要调用后端 API 验证 token
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
}

export default new AuthService(); 