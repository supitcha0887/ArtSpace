// Popup functions สำหรับ Activity Detail
let currentPopupOverlay = null;
let currentActivityId = null;

function openActivityPopup(activityId) {
    currentActivityId = activityId;

    // สร้าง popup ถ้ายังไม่มี
    if (!currentPopupOverlay) {
        createActivityPopup();
    }

    const content = currentPopupOverlay.querySelector('#popupContent');

    // แสดง popup
    currentPopupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // แสดง loading
    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';

    // โหลดข้อมูล
    setTimeout(() => {
        loadActivityData(activityId);
    }, 300);
}

function createActivityPopup() {
    // สร้าง CSS สำหรับ popup
    if (!document.getElementById('activity-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'activity-popup-styles';
        style.textContent = `
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .popup-overlay.active {
                display: flex;
                opacity: 1;
            }
            .popup-container {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                transform: scale(0.8) translateY(50px);
                transition: transform 0.3s ease;
            }
            .popup-overlay.active .popup-container {
                transform: scale(1) translateY(0);
            }
            .popup-header {
                display: flex;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #f0f0f0;
            }
            .back-btn {
                background: none;
                border: none;
                font-size: 24px;
                color: #00bcd4;
                cursor: pointer;
                margin-right: 15px;
                padding: 5px;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            .back-btn:hover {
                background-color: #f0f9fa;
            }
            .popup-title {
                font-size: 20px;
                font-weight: 600;
                color: #333;
            }
            .popup-content {
                padding: 25px;
            }
            .activity-image {
                width: 120px;
                height: 80px;
                border-radius: 12px;
                object-fit: cover;
                margin: 0 auto 20px;
                display: block;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .organizer-row {
                align-items: center;
                gap: 8px;
            }

            .organizer-name {
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
                font-size: 14px;
            }

            .star-icon {
                width: 16px;
                height: 16px;
                object-fit: contain;
            }

            .info-row {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 15px;
                align-items: center; 
            }
            .info-value img{
                paddind-top: 5px;   
                width: 20px;
                hight: 20px;
            }

            .info-label {
                font-weight: 500;
                color: #555;
                min-width: 120px;
                font-size: 14px;
                margin-bottom: 6px;
            }
            .info-value {
                color: #333;
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            .datetime-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .datetime-col{
                display:flex;
                flex-direction:column;
                align-items:flex-start;
                gap:10px;
            }
            .datetime-col .date-input,
            .datetime-col .time-input{
                width:100%;
            }
            .date-input, .time-input {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
            }
            .capacity-input {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
                width: 60px;
                text-align: center;
                margin-bottom: 6px;
            }

            .capacity-note {
                font-size: 13px;
                color: #666;
                display: block;
                margin-top: -4px;
                margin-left: 120px; /* เว้นให้ตรงกับ label */
            }
            .join-btn {
                background: linear-gradient(135deg, #ffd54f, #ffcc02);
                border: none;
                border-radius: 25px;
                padding: 12px 30px;
                font-size: 16px;
                font-weight: 600;
                color: #333;
                cursor: pointer;
                width: 100%;
                margin-top: 25px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 204, 2, 0.3);
            }
            .join-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 204, 2, 0.4);
            }
            .loading {
                text-align: center;
                padding: 20px;
                color: #666;
            }
            .category {
                text-align: center;
                color: #6A1B9A;
                font-weight: bold;
                margin-bottom: 15px;
            }
            
            
            @media (max-width: 768px) {
            .datetime-row {
                flex-direction: column;
                align-items: flex-start;
            }

            .capacity-note {
                margin-left: 0;
            }
            .search-bar {
                flex-direction: column;
                align-items: stretch;
                padding: 16px;
                border-radius: 18px;
                gap: 14px;
                background: rgba(255, 255, 255, 0.95);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }

            .search-bar > div:first-child {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
            }

            .lens {
                width: 32px;
                height: 32px;
                min-width: 32px;
                background: #eee;
            }

            .lens img {
                width: 22px;
                height: 22px;
            }

            .q {
                flex: 1;
                width: 100%;
                font-size: 16px;
                padding: 10px 14px;
                border-radius: 10px;
                border: 1px solid #ddd;
                background: #fafafa;
            }

            .chips {
                flex-wrap: wrap;
                gap: 6px;
            }

            .bar-right {
                flex-direction: column;
                align-items: stretch;
                width: 100%;
                gap: 12px;
            }

            .bar-right .btn,
            .bar-right .dropdown,
            .bar-right select {
                width: 100%;
                font-size: 15px;
            }

            .btn-primary {
                background-color: #f6d51f;
                color: black;
                font-weight: 700;
            }
            }
        `;
        document.head.appendChild(style);
    }

    // สร้าง popup HTML
    currentPopupOverlay = document.createElement('div');
    currentPopupOverlay.className = 'popup-overlay';
    currentPopupOverlay.id = 'popupOverlay';

    currentPopupOverlay.innerHTML = `
        <div class="popup-container">
            <div class="popup-header">
                <button class="back-btn" onclick="closeActivityPopup()">←</button>
                <h2 class="popup-title">Detail Activity</h2>
            </div>
            <div class="popup-content" id="popupContent">
                <div class="loading">กำลังโหลดข้อมูล...</div>
            </div>
        </div>
    `;

    document.body.appendChild(currentPopupOverlay);

    // เพิ่ม event listeners
    currentPopupOverlay.addEventListener('click', (e) => {
        if (e.target === currentPopupOverlay) {
            closeActivityPopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentPopupOverlay && currentPopupOverlay.classList.contains('active')) {
            closeActivityPopup();
        }
    });
}

function loadActivityData(activityId) {
    // ใช้ข้อมูลจาก window.mockActivitiesDetail ที่ตั้งไว้ใน Activity.js
    const activity = window.mockActivitiesDetail && window.mockActivitiesDetail[activityId];
    const content = currentPopupOverlay.querySelector('#popupContent');

    if (!activity) {
        content.innerHTML = '<div class="loading">ไม่พบข้อมูลกิจกรรม</div>';
        console.error('Activity not found:', activityId, 'Available:', Object.keys(window.mockActivitiesDetail || {}));
        return;
    }

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        });
    };

    content.innerHTML = `
        <h2 class="category">${activity.category}</h2>
        <img src="${activity.img}" alt="Activity Image" class="activity-image">
        
        <div class="info-row">
            <span class="info-label">ชื่อกิจกรรม :</span>
            <span class="info-value">${activity.title}</span>
        </div>

        <div class="info-row">
            <span class="info-label">รายละเอียด :</span>
            <span class="info-value">${activity.description}</span>
        </div>

        <div class="info-row">
            <span class="info-label">วันที่เริ่มจัดกิจกรรม :</span>
            <div class="datetime-row">
                <input type="date" class="date-input" value="${activity.startDate}" readonly>
                <input type="time" class="time-input" value="${activity.startTime}" readonly>
            </div>
        </div>

        <div class="info-row">
            <span class="info-label">วันที่สิ้นสุดกิจกรรม :</span>
            <div class="datetime-row">
                <input type="date" class="date-input" value="${activity.endDate}" readonly>
                <input type="time" class="time-input" value="${activity.endTime}" readonly>
            </div>
        </div>

        <div class="info-row">
            <span class="info-label">สถานที่ :</span>
            <span class="info-value">${activity.location}</span>
        </div>

        <div class="info-row">
            <span class="info-label">จำนวนที่รับ :</span>
            <div class="datetime-row">
                <input type="number" class="capacity-input" value="${activity.capacity}" readonly>
                <span class="capacity-note">เข้าร่วมแล้ว ${activity.joined} คน</span>
            </div>
        </div>

        <div class="info-row">
            <span class="info-label">วันหมดอายุของประกาศ :</span>
            <div class="datetime-col">
                <input type="date" class="date-input" value="${activity.deadline}" readonly>
                <input type="time" class="time-input" value="${activity.deadlineTime}" readonly>
            </div>
        </div>


        <div class="info-row organizer-row">
            <span class="info-label">ผู้จัด :</span>
            <span class="info-value organizer-name">
                ${activity.host} · ${activity.rating.toFixed(1)} 
                <img src="/img/star-icon.png" alt="star" class="star-icon">
            </span>
        </div>

        <button class="join-btn" onclick="joinActivity()">Join now</button>
    `;
}

function closeActivityPopup() {
    if (currentPopupOverlay) {
        currentPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';
        currentActivityId = null;
    }
}

function joinActivity() {
    if (!currentActivityId) return;

    const activity = window.mockActivitiesDetail && window.mockActivitiesDetail[currentActivityId];

    if (activity) {
        alert(`กำลังสมัครเข้าร่วมกิจกรรม: ${activity.title}`);
        closeActivityPopup();
    } else {
        alert('ไม่สามารถสมัครได้ กรุณาลองใหม่อีกครั้ง');
    }
}

// ทำให้ฟังก์ชันเป็น global เพื่อใช้ในหน้าอื่น
window.openActivityPopup = openActivityPopup;
window.closeActivityPopup = closeActivityPopup;
window.joinActivity = joinActivity;