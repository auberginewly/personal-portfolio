// notifications.js - 消息提示功能

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    const notification = createNotificationElement(message, type);
    document.body.appendChild(notification);
    
    // 触发动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    return notification;
}

// 创建通知元素
function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="hideNotification(this.parentElement)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return notification;
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// 隐藏通知
function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// 显示加载提示
function showLoading(message = '加载中...') {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-message">${message}</div>
        </div>
    `;
    
    document.body.appendChild(loader);
    return loader;
}

// 隐藏加载提示
function hideLoading(loader) {
    if (loader && loader.parentElement) {
        loader.classList.add('hide');
        setTimeout(() => {
            if (loader.parentElement) {
                loader.parentElement.removeChild(loader);
            }
        }, 300);
    }
}

// 确认对话框
function showConfirm(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-content">
            <div class="confirm-message">${message}</div>
            <div class="confirm-actions">
                <button class="btn-cancel">取消</button>
                <button class="btn-confirm">确认</button>
            </div>
        </div>
    `;
    
    const cancelBtn = modal.querySelector('.btn-cancel');
    const confirmBtn = modal.querySelector('.btn-confirm');
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (onCancel) onCancel();
    });
    
    confirmBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        if (onConfirm) onConfirm();
    });
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        }
    });
}

// 初始化通知样式
function initNotifications() {
    // 添加通知样式到页面
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 16px;
                max-width: 400px;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.hide {
                transform: translateX(100%);
            }
            
            .notification-success {
                border-left: 4px solid #4CAF50;
                color: #2E7D32;
            }
            
            .notification-error {
                border-left: 4px solid #F44336;
                color: #C62828;
            }
            
            .notification-warning {
                border-left: 4px solid #FF9800;
                color: #F57C00;
            }
            
            .notification-info {
                border-left: 4px solid #2196F3;
                color: #1565C0;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }
            
            .notification-close:hover {
                background: #f5f5f5;
            }
            
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            }
            
            .loading-content {
                background: white;
                padding: 32px;
                border-radius: 8px;
                text-align: center;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4FACFE;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .confirm-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
            }
            
            .confirm-content {
                background: white;
                padding: 24px;
                border-radius: 8px;
                max-width: 400px;
                text-align: center;
            }
            
            .confirm-message {
                margin-bottom: 24px;
                font-size: 16px;
            }
            
            .confirm-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            
            .btn-cancel, .btn-confirm {
                padding: 8px 16px;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                background: white;
            }
            
            .btn-confirm {
                background: #4FACFE;
                color: white;
                border-color: #4FACFE;
            }
            
            .btn-cancel:hover {
                background: #f5f5f5;
            }
            
            .btn-confirm:hover {
                background: #3A9BFE;
            }
        `;
        document.head.appendChild(styles);
    }
}

// 导出函数
export { 
    showNotification, 
    hideNotification, 
    showLoading, 
    hideLoading, 
    showConfirm, 
    initNotifications 
};
