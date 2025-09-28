//  // Validate participant limit
//         function validateParticipantLimit() {
//             const newLimit = parseInt(document.getElementById('participantLimit').value);
//             const acceptedCount = participants.filter(p => p.status === 'accepted').length;
            
//             if (newLimit < acceptedCount) {
//                 alert(`จำนวนที่รับไม่สามารถน้อยกว่าจำนวนผู้ที่ยอมรับแล้ว (${acceptedCount} คน)`);
//                 document.getElementById('participantLimit').value = Math.max(acceptedCount, mockActivityData.participantLimit);
//                 return false;
//             }
            
//             document.getElementById('totalLimit').textContent = newLimit;
//             return true;
//         }

//         // Handle file upload
//         function handleFileUpload(event) {
//             const file = event.target.files[0];
//             if (file) {
//                 document.getElementById('fileName').textContent = file.name;
//             }
//         }        .file-upload {
//             display: flex;
//             align-items: center;
//             gap: 15px;
//         }

//         .file-upload input[type="file"] {
//             display: none;*/
// Mock data for testing
const mockActivityData = {
    id: 'activity_001',
    name: 'ไวโอลีนน่ารักที่สุดเลย',
    description: 'กิจกรรมการเรียนรู้การเล่นไวโอลีนสำหรับผู้เริ่มต้น พร้อมกับการแสดงดนตรีในงานศิลปะ',
    startDate: '2025-10-15',
    startTime: '09:00',
    endDate: '2025-10-15',
    endTime: '17:00',
    location: 'ห้องดนตรี ชั้น 3 อาคารศิลปกรรม',
    participantLimit: 5,
    expiryDate: '2025-10-10',
    expiryTime: '23:59',
    category: 'music',
    posterUrl: 'poster.jpg'
};

const mockParticipants = [
    {
        id: 'user_001',
        name: 'ไวโอลีนน่ารักที่สุดเลย',
        username: '@Cutekhai',
        avatar: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=🐹',
        rating: 5.0,
        status: 'accepted',
        joinDate: '2025-09-25'
    },
    {
        id: 'user_002',
        name: 'ไวโอลีนน่ารักที่สุดเลย',
        username: '@Cutekhai',
        avatar: 'https://via.placeholder.com/60x60/4ECDC4/FFFFFF?text=🎨',
        rating: 5.0,
        status: 'pending',
        joinDate: '2025-09-26'
    },
    {
        id: 'user_003',
        name: 'ไวโอลีนน่ารักที่สุดเลย',
        username: '@Cutekhai',
        avatar: 'https://via.placeholder.com/60x60/45B7D1/FFFFFF?text=🎭',
        rating: 5.0,
        status: 'rejected',
        joinDate: '2025-09-24'
    },
    {
        id: 'user_004',
        name: 'ไวโอลีนน่ารักที่สุดเลย',
        username: '@Cutekhai',
        avatar: 'https://via.placeholder.com/60x60/F39C12/FFFFFF?text=🎪',
        rating: 5.0,
        status: 'accepted',
        joinDate: '2025-09-27'
    },
    {
        id: 'user_005',
        name: 'ไวโอลีนน่ารักที่สุดเลย',
        username: '@Cutekhai',
        avatar: 'https://via.placeholder.com/60x60/E74C3C/FFFFFF?text=🎯',
        rating: 5.0,
        status: 'pending',
        joinDate: '2025-09-23'
    },
    {
        id: 'user_006',
        name: 'ไวโอลีนน่ารักที่สุดเลย',
        username: '@Cutekhai',
        avatar: 'https://via.placeholder.com/60x60/9B59B6/FFFFFF?text=🎲',
        rating: 5.0,
        status: 'pending',
        joinDate: '2025-09-28'
    }
];

let participants = [...mockParticipants];
let sortState = 'none'; // 'none', 'rating', 'date'

// Initialize the page
function initializePage() {
    loadActivityData();
    renderParticipants();
    updateAcceptedCount();
    checkDateEditability();
}

// Load activity data into form
function loadActivityData() {
    document.getElementById('activityName').value = mockActivityData.name;
    document.getElementById('activityDescription').value = mockActivityData.description;
    document.getElementById('startDate').value = mockActivityData.startDate;
    document.getElementById('startTime').value = mockActivityData.startTime;
    document.getElementById('endDate').value = mockActivityData.endDate;
    document.getElementById('endTime').value = mockActivityData.endTime;
    document.getElementById('location').value = mockActivityData.location;
    document.getElementById('participantLimit').value = mockActivityData.participantLimit;
    document.getElementById('totalLimit').textContent = mockActivityData.participantLimit;
    document.getElementById('expiryDate').value = mockActivityData.expiryDate;
    document.getElementById('expiryTime').value = mockActivityData.expiryTime;
}

// Check if dates can be edited (must be more than 1 day before activity)
function checkDateEditability() {
    const now = new Date();
    const activityStart = new Date(mockActivityData.startDate + 'T' + mockActivityData.startTime);
    const timeDiff = activityStart - now;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    const dateInputs = ['startDate', 'startTime', 'endDate', 'endTime'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (daysDiff <= 1) {
            input.disabled = true;
            input.title = 'ไม่สามารถแก้ไขได้ เนื่องจากเหลือเวลาน้อยกว่า 1 วัน';
        }
    });
}

// Render participants
function renderParticipants() {
    const grid = document.getElementById('participantsGrid');
    grid.innerHTML = '';

    participants.forEach(participant => {
        const card = createParticipantCard(participant);
        grid.appendChild(card);
    });
}

// Create participant card
function createParticipantCard(participant) {
    const card = document.createElement('div');
    card.className = 'participant-card';
    card.innerHTML = `
                <div class="status-badge status-${participant.status}">
                    ${getStatusText(participant.status)}
                </div>
                <div class="participant-info">
                    <img src="${participant.avatar}" alt="${participant.name}" class="avatar" onclick="viewProfile('${participant.id}')">
                    <div class="participant-details">
                        <h3>${participant.name}</h3>
                        <p>${participant.username}</p>
                        <div class="rating">
                            ⭐ ${participant.rating}
                        </div>
                        <p>${participant.joinDate}</p>
                    </div>
                </div>
                <div class="participant-actions">
                    <button class="action-btn reject" onclick="updateStatus('${participant.id}', 'rejected')">Reject</button>
                    <button class="action-btn accept" onclick="updateStatus('${participant.id}', 'accepted')">Accept</button>
                </div>
            `;
    return card;
}

// Get status text in Thai
function getStatusText(status) {
    switch (status) {
        case 'accepted': return 'Accept';
        case 'rejected': return 'Reject';
        case 'pending': return 'Pending';
        default: return 'Pending';
    }
}

// Update participant status
function updateStatus(participantId, newStatus) {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
        // Check if we can accept more participants
        if (newStatus === 'accepted') {
            const acceptedCount = participants.filter(p => p.status === 'accepted').length;
            if (acceptedCount >= mockActivityData.participantLimit) {
                alert('ไม่สามารถรับผู้เข้าร่วมเพิ่มได้ เนื่องจากถึงจำนวนจำกัดแล้ว');
                return;
            }
        }

        participant.status = newStatus;
        renderParticipants();
        updateAcceptedCount();
    }
}

// Update accepted count
function updateAcceptedCount() {
    const acceptedCount = participants.filter(p => p.status === 'accepted').length;
    document.getElementById('acceptedCount').textContent = acceptedCount;
}

// View participant profile
function viewProfile(participantId) {
    // Redirect to profile page with participant ID
    window.location.href = `profile.html?id=${participantId}`;
}

// Sort functions
document.getElementById('sortByRating').addEventListener('click', function () {
    participants.sort((a, b) => b.rating - a.rating);
    sortState = 'rating';
    updateSortButtons();
    renderParticipants();
});

document.getElementById('sortByDate').addEventListener('click', function () {
    participants.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
    sortState = 'date';
    updateSortButtons();
    renderParticipants();
});

document.getElementById('clearSort').addEventListener('click', function () {
    participants = [...mockParticipants];
    sortState = 'none';
    updateSortButtons();
    renderParticipants();
});

document.getElementById('acceptRandomly').addEventListener('click', function () {
    acceptRandomParticipants();
});

// Update sort button states
function updateSortButtons() {
    const buttons = document.querySelectorAll('.sort-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (sortState === 'rating') {
        document.getElementById('sortByRating').classList.add('active');
    } else if (sortState === 'date') {
        document.getElementById('sortByDate').classList.add('active');
    }
}

// Accept random participants
function acceptRandomParticipants() {
    const limit = parseInt(document.getElementById('participantLimit').value);
    const pendingParticipants = participants.filter(p => p.status === 'pending');
    const acceptedCount = participants.filter(p => p.status === 'accepted').length;
    const availableSlots = limit - acceptedCount;

    if (availableSlots <= 0) {
        alert('ไม่มีที่ว่างสำหรับรับผู้เข้าร่วมเพิ่ม');
        return;
    }

    // Shuffle and select random participants
    const shuffled = [...pendingParticipants].sort(() => 0.5 - Math.random());
    const toAccept = shuffled.slice(0, Math.min(availableSlots, pendingParticipants.length));

    toAccept.forEach(participant => {
        participant.status = 'accepted';
    });

    renderParticipants();
    updateAcceptedCount();
}

// Go back function
function goBack() {
    if (confirm('คุณต้องการกลับไปหน้าก่อนหน้าหรือไม่? การเปลี่ยนแปลงที่ไม่ได้บันทึกจะหายไป')) {
        history.back();
    }
}

// Show cancel modal
function showCancelModal() {
    document.getElementById('cancelModal').style.display = 'block';
}

// Close cancel modal
function closeCancelModal() {
    document.getElementById('cancelModal').style.display = 'none';
}

// Confirm cancel activity
function confirmCancelActivity() {
    // Send notification data for all participants
    const notificationData = participants.map(p => ({
        userId: p.id,
        activityId: mockActivityData.id,
        activityName: mockActivityData.name,
        type: 'activity_cancelled',
        message: `กิจกรรม "${mockActivityData.name}" ได้ถูกยกเลิกแล้ว`
    }));

    console.log('Sending cancellation notifications:', notificationData);

    // Update activity status to deleted
    mockActivityData.status = 'deleted';

    alert('ยกเลิกกิจกรรมเรียบร้อยแล้ว');
    closeCancelModal();

    // Redirect back
    setTimeout(() => {
        history.back();
    }, 1000);
}

// Cancel changes
function cancelChanges() {
    if (confirm('คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่?')) {
        // Reset to original data
        loadActivityData();
        participants = [...mockParticipants];
        renderParticipants();
        updateAcceptedCount();

        // Go back to previous page
        setTimeout(() => {
            history.back();
        }, 500);
    }
}

// Save changes
function saveChanges() {
    // Validate form
    const activityName = document.getElementById('activityName').value;
    const description = document.getElementById('activityDescription').value;
    const location = document.getElementById('location').value;

    if (!activityName.trim() || !description.trim() || !location.trim()) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    if (!validateParticipantLimit()) {
        return;
    }

    // Collect updated data
    const updatedData = {
        id: mockActivityData.id,
        name: activityName,
        description: description,
        startDate: document.getElementById('startDate').value,
        startTime: document.getElementById('startTime').value,
        endDate: document.getElementById('endDate').value,
        endTime: document.getElementById('endTime').value,
        location: location,
        participantLimit: parseInt(document.getElementById('participantLimit').value),
        expiryDate: document.getElementById('expiryDate').value,
        expiryTime: document.getElementById('expiryTime').value
    };

    // Send notification data for status changes
    const notificationData = participants.filter(p => {
        const original = mockParticipants.find(orig => orig.id === p.id);
        return original && original.status !== p.status;
    }).map(p => ({
        userId: p.id,
        activityId: mockActivityData.id,
        activityName: updatedData.name,
        type: p.status === 'accepted' ? 'application_accepted' : 'application_rejected',
        message: p.status === 'accepted'
            ? `คุณได้รับการยอมรับเข้าร่วมกิจกรรม "${updatedData.name}"`
            : `ขออภัย คุณไม่ได้รับการยอมรับเข้าร่วมกิจกรรม "${updatedData.name}"`
    }));

    console.log('Saving activity data:', updatedData);
    console.log('Sending status change notifications:', notificationData);

    // Update mock data
    Object.assign(mockActivityData, updatedData);

    alert('บันทึกข้อมูลเรียบร้อยแล้ว');

    // Go back to previous page
    setTimeout(() => {
        history.back();
    }, 1000);
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
});