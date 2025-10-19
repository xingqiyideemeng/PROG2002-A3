// 通用工具函数
class Utils {
    static formatCurrency(amountCents, currency = 'AUD') {
        const amount = amountCents / 100;
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static showNotification(message, type = 'info') {
        // 简单的通知实现
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            border-radius: 4px;
            z-index: 1001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// API 服务类
class ApiService {
    static async get(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
}
// 导航栏注册按钮功能
class NavRegisterButton {
    constructor() {
        this.navRegisterBtn = document.getElementById('navRegisterBtn');
        this.registerModal = document.getElementById('registerModal');
        this.init();
    }

    init() {
        if (this.navRegisterBtn) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.navRegisterBtn.addEventListener('click', () => {
            this.showRegisterModal();
        });

        // 如果当前页面有注册模态框，也设置相关事件
        if (this.registerModal) {
            this.setupModalEvents();
        }
    }

    showRegisterModal() {
        // 创建或显示注册模态框
        this.createRegisterModal();
    }

    createRegisterModal() {
        // 检查是否已存在模态框
        let modal = document.getElementById('navRegisterModal');
        
        if (!modal) {
            // 创建新的模态框
            modal = document.createElement('div');
            modal.id = 'navRegisterModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn" onclick="closeNavRegisterModal()">&times;</span>
                    <div class="modal-header">
                        <h3>🔮 Explore more possibilities</h3>
                    </div>
                    <div class="modal-body">
                        <div class="construction-animation">
                            <div class="construction-icon">🚀</div>
                            <h4>The user registration function is about to be launched!</h4>
                            <p>We are building a complete user system, enabling you to:</p>
                            <ul class="feature-list">
                                <li>📝 Quick registration for the event</li>
                                <li>❤️ Save the activities you are interested in.</li>
                                <li>📊 Manage your participation records</li>
                                <li>🔔 Receive personalized notifications</li>
                            </ul>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                                <span class="progress-text">Development progress: 75%</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary" onclick="closeNavRegisterModal()">Looking forward to the new features!</button>
                        <button class="btn-secondary" onclick="closeNavRegisterModal()">Check later</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    setupModalEvents() {
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('navRegisterModal');
            if (modal && e.target === modal) {
                this.closeNavRegisterModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNavRegisterModal();
            }
        });
    }

    closeNavRegisterModal() {
        const modal = document.getElementById('navRegisterModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// 全局函数
function closeNavRegisterModal() {
    const navRegister = new NavRegisterButton();
    navRegister.closeNavRegisterModal();
}

// 初始化导航栏注册按钮
document.addEventListener('DOMContentLoaded', () => {
    new NavRegisterButton();
});