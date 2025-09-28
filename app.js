/* =========================
   app.js (fixed: auto-load navbar + modal login + global auth UI)
   ========================= */

const BASE_URL = "http://45.141.27.231:5000";

const users = [
  {
    username: "admin",
    password: "admin",
    firstName: "System",
    lastName: "Admin",
    nickname: "Boss",
    email: "admin@example.com",
    dateOfBirth: "2000-01-01",
    gender: "other",
    profileImage: "img/default-avatar.png",
  },
];

let currentUser = null;

/* ---------- อัปเดต UI ตามสถานะล็อกอิน ---------- */
function updateAuthUI() {
  currentUser = currentUser || JSON.parse(localStorage.getItem("loggedInUser"));

  // เดสก์ท็อป
  const userInfo = document.getElementById("userInfo");
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const desktopLogout = document.getElementById("desktopLogout");

  // ปุ่ม Log in ทุกตำแหน่ง
  const loginBtns = document.querySelectorAll(".login-btn");

  // มือถือ (drawer)
  const mobileUserInfo = document.getElementById("mobileUserInfo");
  const mobileUserAvatar = document.getElementById("mobileUserAvatar");
  const mobileUserName = document.getElementById("mobileUserName");
  const mobileLogout = document.querySelector(".mobile-logout");
  const mobileAuthItem = document.querySelector(".mobile-auth");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (currentUser) {
    // Desktop
    if (userInfo && userAvatar && userName) {
      userAvatar.src = currentUser.profileImage || "img/default-avatar.png";
      userName.textContent =
        currentUser.nickname ||
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
        currentUser.username;
      userInfo.style.display = "inline-flex";
    }
    if (desktopLogout) desktopLogout.style.display = "inline-flex";

    // Mobile only
    if (isMobile) {
      if (mobileUserInfo && mobileUserAvatar && mobileUserName) {
        mobileUserAvatar.src = currentUser.profileImage || "img/default-avatar.png";
        mobileUserName.textContent =
          currentUser.nickname ||
          `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
          currentUser.username;
        mobileUserInfo.style.display = "block";
      }
      if (mobileLogout) mobileLogout.style.display = "block";
      if (mobileAuthItem) mobileAuthItem.style.display = "none";
    } else {
      if (mobileUserInfo) mobileUserInfo.style.display = "none";
      if (mobileLogout) mobileLogout.style.display = "none";
      if (mobileAuthItem) mobileAuthItem.style.display = "none";
    }

    // hide all login buttons
    loginBtns.forEach((b) => (b.style.display = "none"));
  } else {
    // Desktop
    if (userInfo) userInfo.style.display = "none";
    if (desktopLogout) desktopLogout.style.display = "none";

    // Mobile
    if (isMobile) {
      if (mobileUserInfo) mobileUserInfo.style.display = "none";
      if (mobileLogout) mobileLogout.style.display = "none";
      if (mobileAuthItem) mobileAuthItem.style.display = "block";
    } else {
      if (mobileUserInfo) mobileUserInfo.style.display = "none";
      if (mobileLogout) mobileLogout.style.display = "none";
      if (mobileAuthItem) mobileAuthItem.style.display = "none";
    }

    loginBtns.forEach((b) => (b.style.display = ""));
  }
}

/* ---------- Modal Login/Signin (รองรับหลายปุ่ม) ---------- */
function setupAuthModal() {
  const authModal = document.getElementById("authModal");
  const modalContent = document.getElementById("modalContent");
  const loginBtns = document.querySelectorAll(".login-btn");

  if (loginBtns.length) {
    loginBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        // ปิด drawer มือถือถ้าเปิดอยู่
        const navMenu = document.getElementById("navMenu");
        if (navMenu && navMenu.classList.contains("mobile-active")) {
          navMenu.classList.remove("mobile-active");
          navMenu.style.transform = "translateX(100%)";
        }

        fetch("login.html")
          .then((r) => r.text())
          .then((html) => {
            modalContent.innerHTML = html;
            authModal.classList.add("show");

            const loginTab = document.getElementById("loginTab");
            const signinTab = document.getElementById("signinTab");
            const loginForm = document.getElementById("loginForm");
            const signinForm = document.getElementById("signinForm");
            const closeModalBtn = document.getElementById("closeModalBtn");
            const rightPanel = document.querySelector(".modal-right-section"); 
            const formWrapper = document.querySelector(".form-wrapper");

            rightPanel?.classList.remove("scrollable");
            formWrapper?.classList.remove("scrollable");
            if (rightPanel)  rightPanel.scrollTop  = 0;
            if (formWrapper) formWrapper.scrollTop = 0;

            // สลับแท็บ
            if (loginTab && signinTab && loginForm && signinForm) {
              loginTab.addEventListener("click", (e) => {
                e.preventDefault();
                loginTab.classList.add("active");
                signinTab.classList.remove("active");
                loginForm.classList.add("active");
                signinForm.classList.remove("active");

                rightPanel?.classList.remove("scrollable");
                formWrapper?.classList.remove("scrollable");
                if (rightPanel)  rightPanel.scrollTop  = 0;
                if (formWrapper) formWrapper.scrollTop = 0;
              });
              signinTab.addEventListener("click", (e) => {
                e.preventDefault();
                signinTab.classList.add("active");
                loginTab.classList.remove("active");
                signinForm.classList.add("active");
                loginForm.classList.remove("active");

                rightPanel?.classList.add("scrollable");
                formWrapper?.classList.add("scrollable");
              });
            }

            if (closeModalBtn) {
              closeModalBtn.addEventListener("click", () => {
                authModal.classList.remove("show");
                modalContent.innerHTML = "";
              });
            }

            /* ===== Login submit ===== */
            const loginBtnSubmit = loginForm?.querySelector(".modal-btn.yellow-btn");
            if (loginBtnSubmit) {
              loginBtnSubmit.addEventListener("click", (e) => {
                e.preventDefault();
                const username = document.getElementById("username").value.trim();
                const password = document.getElementById("password").value.trim();

                const localUsers = JSON.parse(localStorage.getItem("users")) || [];
                const user =
                  users.find((u) => u.username === username && u.password === password) ||
                  localUsers.find((u) => u.username === username && u.password === password);

                if (user) {
                  currentUser = user;
                  localStorage.setItem("loggedInUser", JSON.stringify(user));
                  updateAuthUI();
                  authModal.classList.remove("show");
                  modalContent.innerHTML = "";
                } else {
                  alert("❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                }
              });
            }

            /* ===== Sign in submit (สมัครสมาชิก) — ไม่ auto-login ===== */
            const signinBtnSubmit = signinForm?.querySelector(".yellow-btn");
            const profileImageInput = document.getElementById("profileImage");
            const profilePreview = document.getElementById("profilePreview");

            if (profileImageInput) {
              profileImageInput.addEventListener("change", () => {
                if (profileImageInput.files && profileImageInput.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    profilePreview.src = ev.target.result;
                    profilePreview.style.display = "block";
                  };
                  reader.readAsDataURL(profileImageInput.files[0]);
                } else {
                  profilePreview.style.display = "none";
                }
              });
            }

            if (signinBtnSubmit) {
              signinBtnSubmit.addEventListener("click", (e) => {
                e.preventDefault();

                const firstName = document.getElementById("firstName").value.trim();
                const lastName = document.getElementById("lastName").value.trim();
                const username = document.getElementById("signinUsername").value.trim();
                const password = document.getElementById("signinPassword").value.trim();
                const nickname = document.getElementById("nickname").value.trim();
                const email = document.getElementById("signinEmail").value.trim();
                const dateOfBirth = document.getElementById("dateOfBirth").value.trim();
                const gender = document.getElementById("gender").value;

                if (!username || !password || !email) {
                  alert("❌ กรุณากรอก Username, Password และ Email");
                  return;
                }

                let allUsers = JSON.parse(localStorage.getItem("users")) || [];
                if (
                  users.some((u) => u.username === username) ||
                  allUsers.some((u) => u.username === username)
                ) {
                  alert("⚠️ ชื่อนี้ถูกใช้แล้ว กรุณาเลือกชื่ออื่น");
                  return;
                }

                let profileImage = (profilePreview && profilePreview.src) || "img/default-avatar.png";

                function saveUser() {
                  const newUser = {
                    firstName, lastName, username, password, nickname,
                    email, dateOfBirth, gender, profileImage,
                  };
                  allUsers.push(newUser);
                  localStorage.setItem("users", JSON.stringify(allUsers));
                  alert("🎉 สมัครสมาชิกสำเร็จ! กรุณาล็อกอินเพื่อเริ่มใช้งาน");

                  // กลับแท็บ Log in และรีเซ็ตฟอร์มล็อกอิน
                  const loginTab   = document.getElementById("loginTab");
                  const signinTab  = document.getElementById("signinTab");
                  const loginForm  = document.getElementById("loginForm");
                  const signinForm = document.getElementById("signinForm");

                  loginTab?.classList.add("active");
                  signinTab?.classList.remove("active");
                  loginForm?.classList.add("active");
                  signinForm?.classList.remove("active");

                  const rightPanel = document.querySelector(".modal-right-section");
                  const formWrapper = document.querySelector(".form-wrapper");
                  rightPanel?.classList.remove("scrollable");
                  formWrapper?.classList.remove("scrollable");
                  requestAnimationFrame(() => {
                    if (rightPanel)  rightPanel.scrollTop  = 0;
                    if (formWrapper) formWrapper.scrollTop = 0;
                  });

                  loginForm?.reset();
                  const loginUsername = document.getElementById("username");
                  const loginPassword = document.getElementById("password");
                  if (loginUsername) loginUsername.value = "";
                  if (loginPassword) loginPassword.value = "";
                }

                const file = profileImageInput?.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => { profileImage = ev.target.result; saveUser(); };
                  reader.readAsDataURL(file);
                } else {
                  saveUser();
                }
              });
            }
          });
      });
    });
  }

  
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target.id === "authModal") {
        authModal.classList.remove("show");
        if (modalContent) modalContent.innerHTML = "";
      }
    });
  }
}

/* ---------- Logout ทุกตำแหน่ง ---------- */
function setupLogout() {
  function doLogout() {
    localStorage.removeItem("loggedInUser");
    currentUser = null;
    updateAuthUI();

    const navMenu = document.getElementById("navMenu");
    if (navMenu && navMenu.classList.contains("mobile-active")) {
      navMenu.classList.remove("mobile-active");
      navMenu.style.transform = "translateX(100%)";
    }
  }

  const desktopLogout = document.getElementById("desktopLogout");
  if (desktopLogout) desktopLogout.addEventListener("click", doLogout);

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains("logout-btn")) {
      if (t.id !== "desktopLogout") e.preventDefault();
      doLogout();
    }
  });
}

/* ---------- เมนูมือถือ (drawer) ---------- */
function setupMobileMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    navMenu.classList.toggle("mobile-active");
    navMenu.style.transform = navMenu.classList.contains("mobile-active")
      ? "translateX(0)"
      : "translateX(100%)";
  });

  document.addEventListener("click", (e) => {
    if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("mobile-active");
      navMenu.style.transform = "translateX(100%)";
    }
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("mobile-active");
      navMenu.style.transform = "translateX(100%)";
    });
  });
}

/* ---------- Notification Panel ---------- */
function setupNotificationPanel() {
  const notifyBtn = document.querySelector(".notification-btn");
  if (!notifyBtn) return;

  notifyBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    const logged = currentUser || JSON.parse(localStorage.getItem("loggedInUser"));
    if (!logged) { alert("⚠️ กรุณาเข้าสู่ระบบก่อนดูการแจ้งเตือน"); return; }

    let panel = document.getElementById("notificationPanel");
    if (!panel) {
      try {
        const response = await fetch("notify.html");
        const html = await response.text();
        document.body.insertAdjacentHTML("beforeend", html);
        panel = document.getElementById("notificationPanel");
      } catch (err) {
        console.error("โหลด notify.html ไม่สำเร็จ", err);
        return;
      }
    }

    panel.style.display = panel.style.display === "block" ? "none" : "block";

    document.addEventListener("click", (ev) => {
      if (!panel.contains(ev.target) && !notifyBtn.contains(ev.target)) {
        panel.style.display = "none";
      }
    });
  });
}

/* ---------- Header sticky (ถ้าหน้านั้นมี .hero) ---------- */
function setupStickyHeader() {
  const header = document.querySelector("header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) return;

  const onScroll = () => {
    if (window.scrollY > hero.offsetHeight - 50) header.classList.add("sticky");
    else header.classList.remove("sticky");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Activities Carousel (ถ้ามี) ---------- */
function setupActivitiesCarousel() {
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");
  const wrapper = document.querySelector(".activity-cards-wrapper");
  if (!wrapper) return;

  const step = 320;
  leftBtn?.addEventListener("click", () => wrapper.scrollBy({ left: -step, behavior: "smooth" }));
  rightBtn?.addEventListener("click", () => wrapper.scrollBy({ left: step, behavior: "smooth" }));
}

/* ---------- Anchor offset (กัน header บัง) ---------- */
function setupAnchorOffset() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const header = document.querySelector("header");
      const offset = (header?.offsetHeight || 80) + 10;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ---------- โหลด navbar แล้วค่อย bind ทุกอย่าง ---------- */
async function loadNavbarIfNeeded() {
  // ถ้าหน้ามี #navbarMount ให้โหลด navbar.html เข้าไป
  const mount = document.getElementById("navbarMount");
  if (mount) {
    try {
      const html = await fetch("navbar.html").then((r) => r.text());
      mount.innerHTML = html;
    } catch (err) {
      console.error("โหลด navbar.html ไม่สำเร็จ", err);
    }
  }
}

/* ---------- เริ่มทำงาน ---------- */
async function initApp() {
  await loadNavbarIfNeeded(); // ให้ navbar อยู่ใน DOM ก่อน
  setupAuthModal();
  setupMobileMenu();
  setupNotificationPanel();
  setupStickyHeader();
  setupActivitiesCarousel();
  setupAnchorOffset();
  setupLogout();
  updateAuthUI();
  window.addEventListener("resize", () => updateAuthUI());
}

document.addEventListener("DOMContentLoaded", initApp);
