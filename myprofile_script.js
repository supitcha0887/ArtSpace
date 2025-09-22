
// Elements สำหรับ Password Modal
const changePasswordBtn = document.getElementById('change-password-btn');
const passwordModal = document.getElementById('password-modal');
const passwordCancelBtn = document.getElementById('password-cancel-btn');
const passwordSaveBtn = document.getElementById('password-save-btn');
const passwordError = document.getElementById('password-error');

// ฟังก์ชันสำหรับ Password Modal
function openPasswordModal() {
passwordModal.classList.add('active');
document.body.style.overflow = 'hidden';

// ล้างข้อมูลเดิม
document.getElementById('current-password').value = '';
document.getElementById('new-password').value = '';
document.getElementById('confirm-password').value = '';
passwordError.style.display = 'none';
}

function closePasswordModal() {
passwordModal.classList.remove('active');
document.body.style.overflow = 'auto';
}

function savePassword() {
const currentPassword = document.getElementById('current-password').value;
const newPassword = document.getElementById('new-password').value;
const confirmPassword = document.getElementById('confirm-password').value;

// ตรวจสอบรหัสผ่าน
if (!currentPassword || !newPassword || !confirmPassword) {
    passwordError.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    passwordError.style.display = 'flex';
    return;
}

if (newPassword !== confirmPassword) {
    passwordError.textContent = 'รหัสผ่านใหม่ไม่ตรงกัน กรุณาลองใหม่';
    passwordError.style.display = 'flex';
    return;
}

if (newPassword.length < 6) {
    passwordError.textContent = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร';
    passwordError.style.display = 'flex';
    return;
}

// จำลองการตรวจสอบรหัสผ่านเดิม (ในระบบจริงจะส่งไปยัง server)
if (currentPassword !== '123456') { // สำหรับการทดสอบ
    passwordError.textContent = 'รหัสผ่านเดิมที่กรอกของป่อยไม่ถูกต้อง หรือไม่ถูกต้อง กรุณาลองใหม่';
    passwordError.style.display = 'flex';
    return;
}

// หากผ่านการตรวจสอบแล้ว
alert('เปลี่ยนรหัสผ่านสำเร็จ!');
closePasswordModal();
}

// Event Listeners สำหรับ Password Modal
changePasswordBtn.addEventListener('click', openPasswordModal);
passwordCancelBtn.addEventListener('click', closePasswordModal);
passwordSaveBtn.addEventListener('click', savePassword);

// คลิกนอก modal เพื่อปิด
passwordModal.addEventListener('click', function(e) {
if (e.target === passwordModal) {
    closePasswordModal();
}
});

// ปิด modal ด้วย ESC key
document.addEventListener('keydown', function(e) {
if (e.key === 'Escape' && passwordModal.classList.contains('active')) {
    closePasswordModal();
}
});
// Elements สำหรับ Modal
const editButton = document.getElementById('edit-profile-btn');
const modal = document.getElementById('edit-modal');
const cancelButton = document.getElementById('cancel-btn');
const saveButton = document.getElementById('save-btn');
const profileTitle = document.querySelector('.profile-title');
const profileDescription = document.querySelector('.profile-description');
const usernameElement = document.querySelector('.profile-details li:first-child');

// ฟังก์ชันสำหรับ Modal
function openModal() {
modal.classList.add('active');
document.body.style.overflow = 'hidden'; // ป้องกันการ scroll หน้าหลัง

// โหลดข้อมูลปัจจุบันใน modal
document.getElementById('display-name').value = profileTitle.textContent;
document.getElementById('bio').value = profileDescription.textContent.replace(/"/g, '').trim();
}

function closeModal() {
modal.classList.remove('active');
document.body.style.overflow = 'auto'; // เปิดการ scroll หน้าหลัง
}

function saveProfile() {
// ดึงค่าจาก form
const newDisplayName = document.getElementById('display-name').value;
const newBio = document.getElementById('bio').value;

// อัพเดทข้อมูลในหน้าโปรไฟล์
profileTitle.textContent = newDisplayName;
profileDescription.textContent = `"${newBio}"`;

// แสดงข้อความยืนยัน (Optional)
alert('บันทึกข้อมูลเรียบร้อยแล้ว!');

// ปิด modal
closeModal();
}

// Event Listeners สำหรับ Modal
editButton.addEventListener('click', openModal);
cancelButton.addEventListener('click', closeModal);
saveButton.addEventListener('click', saveProfile);

// คลิกนอก modal เพื่อปิด
modal.addEventListener('click', function(e) {
if (e.target === modal) {
    closeModal();
}
});

// ปิด modal ด้วย ESC key
document.addEventListener('keydown', function(e) {
if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
}
});
// รอให้ DOM โหลดเสร็จก่อน
document.addEventListener('DOMContentLoaded', function() {
// ดึง elements ต่างๆ
const galleryCarousel = document.getElementById('gallery-carousel');
const joinedCarousel = document.getElementById('joined-carousel');

// กำหนดระยะทางในการเลื่อน
const scrollAmount = 220; // เพิ่มระยะทางเพื่อให้เลื่อนได้ชัดเจนขึ้น

// ฟังก์ชันสำหรับจัดการการเลื่อน
function handleScroll(direction, carousel) {
    if (!carousel) return;
    
    if (direction === 'left') {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// เพิ่ม event listeners ให้กับปุ่มลูกศร
document.querySelectorAll('.nav-arrow').forEach(arrow => {
    arrow.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        const direction = this.classList.contains('left-arrow') ? 'left' : 'right';
        
        let carousel;
        if (target === 'gallery') {
            carousel = galleryCarousel;
        } else if (target === 'joined') {
            carousel = joinedCarousel;
        }
        
        handleScroll(direction, carousel);
    });
});


});