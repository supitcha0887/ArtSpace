
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

// Gallery Edit Modal Elements
const galleryEditBtn = document.querySelector('.gallery-section-container .edit-section-btn');
const galleryEditModal = document.getElementById('gallery-edit-modal');
const galleryCancelBtn = document.getElementById('gallery-cancel-btn');
const gallerySaveBtn = document.getElementById('gallery-save-btn');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const currentImageGrid = document.getElementById('current-image-grid');

// Gallery Modal Functions
function openGalleryModal() {
    galleryEditModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadCurrentImages();
}

function closeGalleryModal() {
    galleryEditModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function loadCurrentImages() {
    // โหลดรูปภาพปัจจุบันจาก Gallery
    const galleryCards = document.querySelectorAll('.gallery-card img');
    currentImageGrid.innerHTML = '';
    
    galleryCards.forEach((img, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${img.src}" alt="Gallery image ${index + 1}">
            <button class="delete-image-btn" onclick="deleteImage(${index})">×</button>
        `;
        currentImageGrid.appendChild(imageItem);
    });
}

function deleteImage(index) {
    if (confirm('คุณต้องการลบรูปภาพนี้หรือไม่?')) {
        // ลบรูปภาพจาก DOM
        const imageItem = currentImageGrid.children[index];
        imageItem.remove();
        
        // อัพเดท index ใหม่
        Array.from(currentImageGrid.children).forEach((item, newIndex) => {
            const deleteBtn = item.querySelector('.delete-image-btn');
            deleteBtn.setAttribute('onclick', `deleteImage(${newIndex})`);
        });
    }
}

function saveGalleryChanges() {
    // จำลองการบันทึกข้อมูล
    alert('บันทึกการเปลี่ยนแปลง Gallery เรียบร้อยแล้ว!');
    closeGalleryModal();
}

// Upload Area Event Listeners
uploadArea.addEventListener('click', () => {
    imageUpload.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#8A2BE2';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ddd';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    handleFiles(e.dataTransfer.files);
});

imageUpload.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                const currentCount = currentImageGrid.children.length;
                imageItem.innerHTML = `
                    <img src="${e.target.result}" alt="New image">
                    <button class="delete-image-btn" onclick="deleteImage(${currentCount})">×</button>
                `;
                currentImageGrid.appendChild(imageItem);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Gallery Modal Event Listeners
galleryEditBtn.addEventListener('click', openGalleryModal);
galleryCancelBtn.addEventListener('click', closeGalleryModal);
gallerySaveBtn.addEventListener('click', saveGalleryChanges);

// Close modal when clicking outside
galleryEditModal.addEventListener('click', function(e) {
    if (e.target === galleryEditModal) {
        closeGalleryModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryEditModal.classList.contains('active')) {
        closeGalleryModal();
    }
});

//เพิ่มในส่วนที่ดึงข้อมูล API
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  try {
    // ดึงข้อมูล user
    const resUser = await fetch("http://45.141.27.231:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await resUser.json();

    document.getElementById("username").textContent = `🏠 ชื่อผู้ใช้ : ${user.username}`;
    document.getElementById("fullname").textContent = `🎂 ชื่อ-นามสกุล : ${user.fullname}`;
    document.getElementById("email").textContent = `📧 อีเมล : ${user.email}`;
    document.getElementById("birthdate").textContent = `📅 วันเกิด : ${user.birthdate}`;
    document.getElementById("profile-display-name").textContent = user.displayName || user.username;
    document.getElementById("profile-bio").textContent = `"${user.bio || 'ยังไม่มีข้อมูล Bio'}"`;

    // ดึงข้อมูล Joined
    const resJoined = await fetch("http://localhost:5000/api/activity/join", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const joinedData = await resJoined.json();

    // สมมติ API ส่ง { joined_count: 10 }
    document.getElementById("joined-count").textContent = joinedData.joined_count || 0;

  } catch (err) {
    console.error("โหลดข้อมูลไม่สำเร็จ", err);
  }
});



});