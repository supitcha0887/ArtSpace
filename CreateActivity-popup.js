// popup.js - Reusable Popup Manager
class PopupManager {
    constructor() {
        this.popupContainer = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    // สร้างโครงสร้างพื้นฐานของ popup
    init() {
        // สร้าง overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';
        this.overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9998;
            opacity: 0;
        `;

        // สร้าง popup container
        this.popupContainer = document.createElement('div');
        this.popupContainer.className = 'popup-container';
        this.popupContainer.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            max-width: 100%;
            max-height: 100%;
            overflow: auto;
            opacity: 0;
            border-radius:30px;
        `;

        // เพิ่ม elements เข้า body
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.popupContainer);

        // Event listeners
        this.overlay.addEventListener('click', () => this.close());

        // ปิด popup เมื่อกด ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    // เปิด popup ด้วย HTML content
    openWithContent(htmlContent, options = {}) {
        this.popupContainer.innerHTML = htmlContent;
        this.applyOptions(options);
        this.show();
    }

    // เปิด popup โดย fetch จากไฟล์
    async open(url, options = {}) {
        try {
            // แสดง loading
            this.showLoading();

            // Fetch content จากไฟล์
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();

            // ใส่ content เข้า popup
            this.popupContainer.innerHTML = html;

            // Apply options
            this.applyOptions(options);

            // แสดง popup
            this.show();

            // เรียก callback ถ้ามี
            if (options.onLoad) {
                options.onLoad(this.popupContainer);
            }

            // Setup close buttons ที่อยู่ใน popup content
            this.setupCloseButtons();

        } catch (error) {
            console.error('Error loading popup:', error);
            this.popupContainer.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3 style="color: #e74c3c;">เกิดข้อผิดพลาด</h3>
                    <p>ไม่สามารถโหลดเนื้อหาได้</p>
                    <button onclick="popupManager.close()" style="margin-top: 10px; padding: 8px 16px; color: white; border: none; border-radius: 4px; cursor: pointer;">ปิด</button>
                </div>
            `;
            this.show();
        }
    }

    // แสดง loading animation
    showLoading() {
        this.popupContainer.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div class="loading-spinner" style="
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
                <p style="margin-top: 20px; color: #666;">กำลังโหลด...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        this.show();
    }

    // Apply options ต่างๆ
    applyOptions(options) {
        if (options.width) {
            this.popupContainer.style.width = options.width;
        }

        if (options.height) {
            this.popupContainer.style.height = options.height;
        }

        if (options.className) {
            this.popupContainer.classList.add(options.className);
        }
        if (options.maxWidth) this.popupContainer.style.maxWidth = options.maxWidth;
        if (options.maxHeight) this.popupContainer.style.maxHeight = options.maxHeight;

    }

    // Setup ปุ่มปิด popup ที่อยู่ใน content
    setupCloseButtons() {
        const closeButtons = this.popupContainer.querySelectorAll('[data-close-popup]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close());
        });
    }

    // แสดง popup
    show() {
        this.isOpen = true;
        this.overlay.style.display = 'block';
        this.popupContainer.style.display = 'block';

        // Trigger animation
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            this.popupContainer.style.opacity = '1';
            this.popupContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // ป้องกัน body scroll
        document.body.style.overflow = 'hidden';
    }

    // ปิด popup
    close() {
        this.isOpen = false;

        // Animation
        this.overlay.style.opacity = '0';
        this.popupContainer.style.opacity = '0';
        this.popupContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';

        // ซ่อน elements หลัง animation เสร็จ
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.popupContainer.style.display = 'none';
            this.popupContainer.innerHTML = '';

            // คืน body scroll
            document.body.style.overflow = '';
        }, 300);
    }
}

// สร้าง instance เมื่อ DOM โหลดเสร็จ
let popupManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        popupManager = new PopupManager();
    });
} else {
    popupManager = new PopupManager();
}

// Export functions สำหรับใช้งานง่าย
function openPopup(url, options) {
    if (!popupManager) {
        popupManager = new PopupManager();
    }
    return popupManager.open(url, options);
}

function openPopupWithContent(htmlContent, options) {
    if (!popupManager) {
        popupManager = new PopupManager();
    }
    return popupManager.openWithContent(htmlContent, options);
}

function closePopup() {
    if (popupManager) {
        popupManager.close();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.querySelector('#openCreateBtn');
    if (createBtn) {
        createBtn.addEventListener("click", () => {
            openPopup("CreateActivity.html", {
                className: "popup-create",
                onLoad: (container) => {
                }
            });
        });
    }
});
