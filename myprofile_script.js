// ===== PROFILE EDIT MODAL =====
const editButton = document.getElementById('edit-profile-btn');
const modal = document.getElementById('edit-modal');
const cancelButton = document.getElementById('cancel-btn');
const saveButton = document.getElementById('save-btn');
const profileTitle = document.querySelector('.profile-title');
const profileDescription = document.querySelector('.profile-description');
const avatarPreview = document.getElementById('avatar-preview');

// เก็บรูปโปรไฟล์ปัจจุบัน
let currentProfileImage = null;

// Profile Modal Functions
function openModal() {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        
        // โหลดข้อมูลปัจจุบันใน modal
        const displayNameInput = document.getElementById('display-name');
        const bioInput = document.getElementById('bio');
        
        if (displayNameInput && profileTitle) {
            displayNameInput.value = profileTitle.textContent;
        }
        if (bioInput && profileDescription) {
            bioInput.value = profileDescription.textContent.replace(/"/g, '').trim();
        }
        
        // โหลดรูปโปรไฟล์ปัจจุบัน
        loadCurrentProfileImage();
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // รีเซ็ตรูปภาพเมื่อปิด modal
        currentProfileImage = null;
    }
}

function loadCurrentProfileImage() {
    const profileImageElement = document.querySelector('.profile-image');
    
    if (avatarPreview && profileImageElement) {
        // ถ้ามีรูปปัจจุบันแล้ว ให้แสดงใน preview
        const currentBgImage = window.getComputedStyle(profileImageElement).backgroundImage;
        
        if (currentBgImage && currentBgImage !== 'none') {
            avatarPreview.style.backgroundImage = currentBgImage;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
            avatarPreview.style.cursor = 'pointer';
            
            // เพิ่ม overlay สำหรับบอกว่าคลิกได้
            avatarPreview.innerHTML = `
                <div style="
                    position: absolute; 
                    bottom: 0; 
                    left: 0; 
                    right: 0; 
                    background: rgba(0,0,0,0.6); 
                    color: white; 
                    padding: 4px; 
                    text-align: center; 
                    font-size: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                ">
                    คลิกเพื่อเปลี่ยนรูป
                </div>
            `;
            
            // แสดง overlay เมื่อ hover
            avatarPreview.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('div');
                if (overlay) overlay.style.opacity = '1';
            });
            
            avatarPreview.addEventListener('mouseleave', function() {
                const overlay = this.querySelector('div');
                if (overlay) overlay.style.opacity = '0';
            });
        } else {
            // ถ้าไม่มีรูป ให้แสดงไอคอนเริ่มต้น
            resetAvatarPreview();
        }
    }
}

function resetAvatarPreview() {
    if (avatarPreview) {
        avatarPreview.style.backgroundImage = 'none';
        avatarPreview.style.backgroundColor = '#f0f0f0';
        avatarPreview.style.cursor = 'pointer';
        avatarPreview.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #999;">
                <i class="fas fa-user" style="font-size: 40px; margin-bottom: 10px;"></i>
                <span style="font-size: 12px;">คลิกเพื่อเปลี่ยนรูป</span>
            </div>
        `;
        avatarPreview.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f0f0';
        });
        
        avatarPreview.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
    }
}

function handleProfileImageChange() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('รูปภาพมีขนาดใหญ่เกิน 5MB กรุณาเลือกรูปภาพที่มีขนาดเล็กกว่า');
                return;
            }
            
            // ตรวจสอบประเภทไฟล์
            if (!file.type.startsWith('image/')) {
                alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                currentProfileImage = e.target.result;
                
                // อัพเดทรูปใน preview
                if (avatarPreview) {
                    avatarPreview.style.backgroundImage = `url(${currentProfileImage})`;
                    avatarPreview.style.backgroundSize = 'cover';
                    avatarPreview.style.backgroundPosition = 'center';
                    avatarPreview.innerHTML = '';
                }
                
                // แสดงข้อความสำเร็จ
                showImageUploadSuccess();
            };
            
            reader.onerror = function() {
                alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    input.click();
}

function showImageUploadSuccess() {
    if (avatarPreview) {
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(76, 175, 80, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            border-radius: 50%;
            z-index: 1000;
        `;
        successOverlay.innerHTML = '<i class="fas fa-check" style="font-size: 20px;"></i>';
        
        avatarPreview.style.position = 'relative';
        avatarPreview.appendChild(successOverlay);
        
        setTimeout(() => {
            if (successOverlay && successOverlay.parentNode) {
                successOverlay.remove();
            }
        }, 1500);
    }
}

function saveProfile() {
    const newDisplayName = document.getElementById('display-name')?.value;
    const newBio = document.getElementById('bio')?.value;

    // อัพเดทชื่อและ bio
    if (newDisplayName && profileTitle) {
        profileTitle.textContent = newDisplayName;
    }
    if (newBio && profileDescription) {
        profileDescription.textContent = `"${newBio}"`;
    }
    
    // อัพเดทรูปโปรไฟล์
    if (currentProfileImage) {
        updateProfileImage(currentProfileImage);
    }

    alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
    closeModal();
}

function updateProfileImage(imageData) {
    const profileImageElement = document.querySelector('.profile-image');
    
    if (profileImageElement) {
        profileImageElement.style.backgroundImage = `url(${imageData})`;
        profileImageElement.style.backgroundSize = 'cover';
        profileImageElement.style.backgroundPosition = 'center';
        
        // เก็บรูปใน localStorage สำหรับใช้งานต่อไป (optional)
        try {
            localStorage.setItem('profileImage', imageData);
        } catch (e) {
            console.warn('Cannot save profile image to localStorage:', e);
        }
    }
}

// โหลดรูปโปรไฟล์จาก localStorage เมื่อเริ่มต้น (optional)
function loadSavedProfileImage() {
    try {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            const profileImageElement = document.querySelector('.profile-image');
            if (profileImageElement) {
                profileImageElement.style.backgroundImage = `url(${savedImage})`;
                profileImageElement.style.backgroundSize = 'cover';
                profileImageElement.style.backgroundPosition = 'center';
            }
        }
    } catch (e) {
        console.warn('Cannot load profile image from localStorage:', e);
    }
}

// ===== PASSWORD CHANGE MODAL =====
const changePasswordBtn = document.getElementById('change-password-btn');
const passwordModal = document.getElementById('password-modal');
const passwordCancelBtn = document.getElementById('password-cancel-btn');
const passwordSaveBtn = document.getElementById('password-save-btn');
const passwordError = document.getElementById('password-error');

// Password Modal Functions
function openPasswordModal() {
    if (passwordModal) {
        passwordModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // ล้างข้อมูลเดิม
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        if (passwordError) passwordError.style.display = 'none';
    }
}

function closePasswordModal() {
    if (passwordModal) {
        passwordModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function savePassword() {
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showPasswordError('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    if (newPassword !== confirmPassword) {
        showPasswordError('รหัสผ่านใหม่ไม่ตรงกัน กรุณาลองใหม่');
        return;
    }

    if (newPassword.length < 6) {
        showPasswordError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
    }

    // จำลองการตรวจสอบรหัสผ่านเดิม
    if (currentPassword !== '123456') {
        showPasswordError('รหัสผ่านเดิมที่กรอกของป่อยไม่ถูกต้อง หรือไม่ถูกต้อง กรุณาลองใหม่');
        return;
    }

    alert('เปลี่ยนรหัสผ่านสำเร็จ!');
    closePasswordModal();
}

function showPasswordError(message) {
    if (passwordError) {
        passwordError.textContent = message;
        passwordError.style.display = 'flex';
    }
}

// ===== GALLERY EDIT MODAL =====
const galleryEditBtn = document.querySelector('.gallery-section-container .edit-section-btn');
const galleryEditModal = document.getElementById('gallery-edit-modal');
const galleryCancelBtn = document.getElementById('gallery-cancel-btn');
const gallerySaveBtn = document.getElementById('gallery-save-btn');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const currentImageGrid = document.getElementById('current-image-grid');

// Array to store current images data
let currentImages = [];
let galleryArrowListeners = [];

// Gallery Modal Functions
function openGalleryModal() {
    if (galleryEditModal) {
        galleryEditModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadCurrentImages();
    }
}

function closeGalleryModal() {
    if (galleryEditModal) {
        galleryEditModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function loadCurrentImages() {
    const galleryCards = document.querySelectorAll('.gallery-card img');
    currentImages = [];
    
    if (currentImageGrid) {
        currentImageGrid.innerHTML = '';
        
        galleryCards.forEach((img, index) => {
            const imageData = {
                id: index,
                src: img.src,
                alt: img.alt || `Gallery image ${index + 1}`
            };
            currentImages.push(imageData);
            
            const imageItem = createImageItem(imageData, index);
            currentImageGrid.appendChild(imageItem);
        });
        
        updateImageIndices();
    }
}

function createImageItem(imageData, index) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.index = index;
    imageItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.alt}" style="width: 100px; height: 100px; object-fit: cover;">
        <button class="delete-image-btn" onclick="deleteImage(${index})">×</button>
    `;
    return imageItem;
}

// Global function - ต้องอยู่ใน global scope เพื่อให้ onclick ใช้ได้
window.deleteImage = function(index) {
    if (confirm('คุณต้องการลบรูปภาพนี้หรือไม่?')) {
        currentImages.splice(index, 1);
        refreshImageGrid();
    }
};

function refreshImageGrid() {
    if (!currentImageGrid) return;
    
    currentImageGrid.innerHTML = '';
    
    currentImages.forEach((imageData, index) => {
        const imageItem = createImageItem(imageData, index);
        currentImageGrid.appendChild(imageItem);
    });
    
    updateImageIndices();
}

function updateImageIndices() {
    if (!currentImageGrid) return;
    
    const deleteButtons = currentImageGrid.querySelectorAll('.delete-image-btn');
    deleteButtons.forEach((btn, index) => {
        btn.setAttribute('onclick', `deleteImage(${index})`);
    });
}

function addNewImage(imageSrc, altText = '') {
    const newImageData = {
        id: Date.now(),
        src: imageSrc,
        alt: altText || `New image ${currentImages.length + 1}`
    };
    
    currentImages.push(newImageData);
    
    const newIndex = currentImages.length - 1;
    const imageItem = createImageItem(newImageData, newIndex);
    
    if (currentImageGrid) {
        currentImageGrid.appendChild(imageItem);
        updateImageIndices();
    }
}

function saveGalleryChanges() {
    try {
        console.log('Saving gallery changes...');
        updateGalleryCarousel();
        
        setTimeout(() => {
            console.log('Refreshing scroll functionality...');
            refreshScrollArrows();
        }, 300);
        
        alert('บันทึกการเปลี่ยนแปลง Gallery เรียบร้อยแล้ว!');
        closeGalleryModal();
    } catch (error) {
        console.error('Error saving gallery changes:', error);
        alert('เกิดข้อผิดพลาดในการบันทึก');
    }
}

function updateGalleryCarousel() {
    const galleryCarousel = document.getElementById('gallery-carousel');
    
    if (!galleryCarousel) {
        console.error('Gallery carousel not found');
        return;
    }
    
    galleryCarousel.innerHTML = '';
    galleryCarousel.scrollLeft = 0;
    
    currentImages.forEach((imageData, index) => {
        const galleryCard = document.createElement('div');
        galleryCard.className = 'gallery-card';
        galleryCard.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.alt}" style="width: 200px; height: 200px; object-fit: cover;">
        `;
        galleryCarousel.appendChild(galleryCard);
    });
    
    if (currentImages.length === 0) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'gallery-card empty-gallery';
        emptyCard.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f5f5f5; border-radius: 10px;">
                <span style="color: #999; font-size: 14px;">ไม่มีรูปภาพใน Gallery</span>
            </div>
        `;
        galleryCarousel.appendChild(emptyCard);
    }
    
    refreshScrollArrows();
}

// File handling functions
function handleFiles(files) {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
    }
    
    const maxImages = 20;
    const remainingSlots = maxImages - currentImages.length;
    
    if (imageFiles.length > remainingSlots) {
        alert(`สามารถเพิ่มรูปภาพได้อีกเพียง ${remainingSlots} รูปเท่านั้น`);
        return;
    }
    
    showLoadingIndicator(true);
    
    let processedCount = 0;
    const totalFiles = imageFiles.length;
    
    imageFiles.forEach((file) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            addNewImage(e.target.result, file.name);
            
            processedCount++;
            if (processedCount === totalFiles) {
                showLoadingIndicator(false);
                showUploadSuccess(totalFiles);
            }
        };
        
        reader.onerror = () => {
            processedCount++;
            console.error(`Error reading file: ${file.name}`);
            
            if (processedCount === totalFiles) {
                showLoadingIndicator(false);
            }
        };
        
        reader.readAsDataURL(file);
    });
}

function showLoadingIndicator(show) {
    let indicator = document.getElementById('upload-loading');
    
    if (show) {
        if (!indicator && uploadArea) {
            indicator = document.createElement('div');
            indicator.id = 'upload-loading';
            indicator.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 5px; margin-top: 10px;">
                    <div class="spinner" style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #8A2BE2; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <span>กำลังอัพโหลดรูปภาพ...</span>
                </div>
            `;
            uploadArea.parentNode.appendChild(indicator);
        }
    } else {
        if (indicator) {
            indicator.remove();
        }
    }
}

function showUploadSuccess(count) {
    if (!galleryEditModal) return;
    
    const successMsg = document.createElement('div');
    successMsg.className = 'upload-success';
    successMsg.textContent = `เพิ่มรูปภาพสำเร็จ ${count} รูป`;
    successMsg.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    galleryEditModal.appendChild(successMsg);
    
    setTimeout(() => {
        if (successMsg && successMsg.parentNode) {
            successMsg.remove();
        }
    }, 3000);
}

// ===== SCROLL ARROW FUNCTIONS =====
function removeGalleryArrowListeners() {
    galleryArrowListeners.forEach(({element, handler}) => {
        if (element && handler) {
            element.removeEventListener('click', handler);
        }
    });
    galleryArrowListeners = [];
}

function addGalleryArrowListeners() {
    const galleryCarousel = document.getElementById('gallery-carousel');
    const scrollAmount = 220;
    
    if (!galleryCarousel) {
        console.warn('Gallery carousel not found');
        return;
    }
    
    function handleScroll(direction) {
        console.log('Scrolling:', direction);
        
        if (direction === 'left') {
            galleryCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (direction === 'right') {
            galleryCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
    
    const galleryLeftArrow = document.querySelector('.gallery-wrapper .nav-arrow.left-arrow[data-target="gallery"]');
    const galleryRightArrow = document.querySelector('.gallery-wrapper .nav-arrow.right-arrow[data-target="gallery"]');
    
    console.log('Found arrows:', {
        left: !!galleryLeftArrow,
        right: !!galleryRightArrow
    });
    
    if (galleryLeftArrow) {
        const leftHandler = () => handleScroll('left');
        galleryLeftArrow.addEventListener('click', leftHandler);
        galleryArrowListeners.push({element: galleryLeftArrow, handler: leftHandler});
        console.log('Left arrow listener added');
    }
    
    if (galleryRightArrow) {
        const rightHandler = () => handleScroll('right');
        galleryRightArrow.addEventListener('click', rightHandler);
        galleryArrowListeners.push({element: galleryRightArrow, handler: rightHandler});
        console.log('Right arrow listener added');
    }
    
    updateArrowVisibility();
}

function refreshScrollArrows() {
    removeGalleryArrowListeners();
    addGalleryArrowListeners();
}

function updateArrowVisibility() {
    const galleryCarousel = document.getElementById('gallery-carousel');
    const leftArrow = document.querySelector('.gallery-wrapper .nav-arrow.left-arrow[data-target="gallery"]');
    const rightArrow = document.querySelector('.gallery-wrapper .nav-arrow.right-arrow[data-target="gallery"]');
    
    if (!galleryCarousel || !leftArrow || !rightArrow) {
        console.warn('Missing elements for arrow visibility update');
        return;
    }
    
    setTimeout(() => {
        const isScrollable = galleryCarousel.scrollWidth > galleryCarousel.clientWidth;
        
        console.log('Arrow visibility check:', {
            scrollWidth: galleryCarousel.scrollWidth,
            clientWidth: galleryCarousel.clientWidth,
            isScrollable: isScrollable,
            imagesCount: currentImages.length
        });
        
        // แสดงปุ่มลูกศรเสมอถ้ามีรูปภาพมากกว่า 1 รูป หรือ scrollable
        if (currentImages.length > 1 || isScrollable) {
            leftArrow.style.display = 'flex';
            rightArrow.style.display = 'flex';
            leftArrow.style.opacity = '1';
            rightArrow.style.opacity = '1';
            leftArrow.style.pointerEvents = 'auto';
            rightArrow.style.pointerEvents = 'auto';
            
            // ฟังก์ชันอัพเดทสถานะปุ่ม
            const updateArrowStates = () => {
                const isAtStart = galleryCarousel.scrollLeft <= 5;
                const isAtEnd = galleryCarousel.scrollLeft >= galleryCarousel.scrollWidth - galleryCarousel.clientWidth - 5;
                
                leftArrow.style.opacity = isAtStart ? '0.5' : '1';
                rightArrow.style.opacity = isAtEnd ? '0.5' : '1';
                
                leftArrow.style.pointerEvents = isAtStart ? 'none' : 'auto';
                rightArrow.style.pointerEvents = isAtEnd ? 'none' : 'auto';
            };
            
            updateArrowStates();
            
            // ลบ listener เดิมก่อนเพิ่มใหม่
            galleryCarousel.removeEventListener('scroll', updateArrowStates);
            galleryCarousel.addEventListener('scroll', updateArrowStates);
            
            console.log('Gallery arrows enabled');
        } else {
            // ซ่อนปุ่มถ้าไม่มีรูปหรือมีรูปเดียว
            if (currentImages.length === 0) {
                leftArrow.style.display = 'none';
                rightArrow.style.display = 'none';
            } else {
                // ถ้ามีรูปเดียว ให้แสดงแต่ปิดการใช้งาน
                leftArrow.style.display = 'flex';
                rightArrow.style.display = 'flex';
                leftArrow.style.opacity = '0.3';
                rightArrow.style.opacity = '0.3';
                leftArrow.style.pointerEvents = 'none';
                rightArrow.style.pointerEvents = 'none';
            }
            
            console.log('Gallery arrows disabled');
        }
    }, 100); // เพิ่มเวลารอให้ DOM อัพเดทเสร็จ
}

// ===== CAROUSEL SCROLL (for Joined section) =====
function handleCarouselScroll() {
    const scrollAmount = 220;
    
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
    
    // Handle all carousel arrows
    document.querySelectorAll('.nav-arrow').forEach(arrow => {
        arrow.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const direction = this.classList.contains('left-arrow') ? 'left' : 'right';
            
            let carousel;
            if (target === 'gallery') {
                // Gallery arrows are handled separately
                return;
            } else if (target === 'joined') {
                carousel = document.getElementById('joined-carousel');
            }
            
            handleScroll(direction, carousel);
        });
    });
}

// ===== EVENT LISTENERS SETUP =====
function setupAllEventListeners() {
    console.log('Setting up all event listeners...');
    
    // Profile Edit Modal
    if (editButton) {
        editButton.addEventListener('click', openModal);
        console.log('Profile edit button listener added');
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', closeModal);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', saveProfile);
    }

    if (avatarPreview) {
        avatarPreview.addEventListener('click', handleProfileImageChange);
        // เพิ่ม cursor pointer เพื่อบอกว่าสามารถคลิกได้
        avatarPreview.style.cursor = 'pointer';
        console.log('Avatar preview click listener added');
    }

    // Password Modal
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openPasswordModal);
        console.log('Change password button listener added');
    }
    
    if (passwordCancelBtn) {
        passwordCancelBtn.addEventListener('click', closePasswordModal);
    }
    
    if (passwordSaveBtn) {
        passwordSaveBtn.addEventListener('click', savePassword);
    }
    
    // Gallery Modal
    if (galleryEditBtn) {
        galleryEditBtn.addEventListener('click', openGalleryModal);
        console.log('Gallery edit button listener added');
    }
    
    if (galleryCancelBtn) {
        galleryCancelBtn.addEventListener('click', closeGalleryModal);
    }
    
    if (gallerySaveBtn) {
        gallerySaveBtn.addEventListener('click', saveGalleryChanges);
    }
    
    // Upload functionality
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            if (imageUpload) imageUpload.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
            uploadArea.style.borderColor = '#8A2BE2';
            uploadArea.style.backgroundColor = '#f8f5ff';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = 'transparent';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = 'transparent';
            
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
    }

    handleCarouselScroll();
    refreshScrollArrows();
    loadSavedProfileImage();
    // Close modals when clicking outside
    [modal, passwordModal, galleryEditModal].forEach(modalElement => {
        if (modalElement) {
            modalElement.addEventListener('click', function(e) {
                if (e.target === modalElement) {
                    if (modalElement === modal) closeModal();
                    else if (modalElement === passwordModal) closePasswordModal();
                    else if (modalElement === galleryEditModal) closeGalleryModal();
                }
            });
        }
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('active')) closeModal();
            if (passwordModal && passwordModal.classList.contains('active')) closePasswordModal();
            if (galleryEditModal && galleryEditModal.classList.contains('active')) closeGalleryModal();
        }
    });
    
    console.log('All event listeners setup completed');
}



// ===== API DATA LOADING =====
document.addEventListener("DOMContentLoaded", async () => {
    console.log('DOM Content Loaded - Initializing...');

    // Setup all event listeners
    setupAllEventListeners();
    
    // Initialize carousel scroll for joined section
    handleCarouselScroll();
    
    // Initialize gallery scroll arrows และแสดงปุ่มตั้งแต่แรก
    setTimeout(() => {
        addGalleryArrowListeners();
        
        // บังคับแสดงปุ่มลูกศรตั้งแต่แรก
        const leftArrow = document.querySelector('.gallery-wrapper .nav-arrow.left-arrow[data-target="gallery"]');
        const rightArrow = document.querySelector('.gallery-wrapper .nav-arrow.right-arrow[data-target="gallery"]');
        
        if (leftArrow && rightArrow) {
            leftArrow.style.display = 'flex';
            rightArrow.style.display = 'flex';
            leftArrow.style.opacity = '1';
            rightArrow.style.opacity = '1';
            leftArrow.style.pointerEvents = 'auto';
            rightArrow.style.pointerEvents = 'auto';
            
            console.log('Gallery arrows force-enabled on startup');
        }
    }, 500);
    
    // Load user data from API
    const token = localStorage.getItem("token");
    if (token) {
        try {
            // ดึงข้อมูลผู้ใช้
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

            // ดึงข้อมูล Joined count
            try {
                const resJoined = await fetch("http://45.141.27.231:5000/api/activity/join", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const joinedData = await resJoined.json();
                document.getElementById("joined-count").textContent = joinedData.joined_count || 0;
                console.log('Joined count loaded:', joinedData.joined_count);
            } catch (joinedErr) {
                console.warn("ไม่สามารถโหลดข้อมูล joined ได้:", joinedErr);
                document.getElementById("joined-count").textContent = "0";
            }

            // ดึงข้อมูล Created count
            try {
                const resCreated = await fetch("http://45.141.27.231:5000/api/activity/created", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const createdData = await resCreated.json();
                document.getElementById("created-count").textContent = createdData.created_count || 0;
                console.log('Created count loaded:', createdData.created_count);
            } catch (createdErr) {
                console.warn("ไม่สามารถโหลดข้อมูล created ได้:", createdErr);
                document.getElementById("created-count").textContent = "0";
            }

            // ดึงข้อมูล Posted count
            try {
                const resPosted = await fetch("http://45.141.27.231:5000/api/activity/posted", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const postedData = await resPosted.json();
                document.getElementById("posted-count").textContent = postedData.posted_count || 0;
                console.log('Posted count loaded:', postedData.posted_count);
            } catch (postedErr) {
                console.warn("ไม่สามารถโหลดข้อมูล posted ได้:", postedErr);
                document.getElementById("posted-count").textContent = "0";
            }

        } catch (err) {
            console.error("โหลดข้อมูลไม่สำเร็จ", err);
            
            // แสดงค่าเริ่มต้นถ้าเกิดข้อผิดพลาด
            document.getElementById("joined-count").textContent = "0";
            document.getElementById("created-count").textContent = "0";
            document.getElementById("posted-count").textContent = "0";
        }
    } else {
        console.warn("ไม่พบ token - ไม่สามารถโหลดข้อมูลได้");
        
        // แสดงค่าเริ่มต้นถ้าไม่มี token
        document.getElementById("joined-count").textContent = "0";
        document.getElementById("created-count").textContent = "0";
        document.getElementById("posted-count").textContent = "0";
    }
    
    // โหลดรูปโปรไฟล์ที่บันทึกไว้
    loadSavedProfileImage();
    
    console.log('Profile script initialization completed');
});