// -----------------------------
// เก็บบัญชีตัวอย่าง (fix) + สถานะล็อกอิน
// -----------------------------
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

// -----------------------------
// ฟังก์ชันเปิด Modal Login/Signin
// -----------------------------
function setupAuthModal() {
  const authModal = document.getElementById("authModal");
  const modalContent = document.getElementById("modalContent");
  const loginBtn = document.querySelector(".login-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fetch("login.html")
        .then((response) => response.text())
        .then((html) => {
          modalContent.innerHTML = html;
          authModal.classList.add("show");

          const loginTab = document.getElementById("loginTab");
          const signinTab = document.getElementById("signinTab");
          const loginForm = document.getElementById("loginForm");
          const signinForm = document.getElementById("signinForm");
          const closeModalBtn = document.getElementById("closeModalBtn");
          const authModalContainer = document.getElementById("authModal");

          // -----------------------------
          // สลับแท็บ Login / Signin
          // -----------------------------
          if (loginTab && signinTab && loginForm && signinForm) {
            loginTab.addEventListener("click", (e) => {
              e.preventDefault();
              loginTab.classList.add("active");
              signinTab.classList.remove("active");
              loginForm.classList.add("active");
              signinForm.classList.remove("active");
            });

            signinTab.addEventListener("click", (e) => {
              e.preventDefault();
              signinTab.classList.add("active");
              loginTab.classList.remove("active");
              signinForm.classList.add("active");
              loginForm.classList.remove("active");
            });
          }

          // -----------------------------
          // ปิด Modal
          // -----------------------------
          if (closeModalBtn && authModalContainer) {
            closeModalBtn.addEventListener("click", () => {
              authModalContainer.classList.remove("show");
              document.getElementById("modalContent").innerHTML = "";
            });
          }

          // -----------------------------
          // จัดการฟอร์ม Login
          // -----------------------------
          const loginBtnSubmit = loginForm.querySelector(".modal-btn.yellow-btn");
          if (loginBtnSubmit) {
            loginBtnSubmit.addEventListener("click", (e) => {
              e.preventDefault();
              const username = document.getElementById("username").value.trim();
              const password = document.getElementById("password").value.trim();

              const localUsers = JSON.parse(localStorage.getItem("users")) || [];
              const user =
                users.find(
                  (u) => u.username === username && u.password === password
                ) ||
                localUsers.find(
                  (u) => u.username === username && u.password === password
                );

              if (user) {
                currentUser = user;
                localStorage.setItem("loggedInUser", JSON.stringify(user));

                const userInfo = document.getElementById("userInfo");
                const userAvatar = document.getElementById("userAvatar");
                const userName = document.getElementById("userName");

                if (userInfo && userAvatar && userName && loginBtn) {
                  userAvatar.src = user.profileImage || "img/default-avatar.png";
                  userName.textContent =
                    user.nickname ||
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    user.username;
                  userInfo.style.display = "inline-flex";
                  loginBtn.style.display = "none";
                }

                authModal.classList.remove("show");
                modalContent.innerHTML = "";
              } else {
                alert("❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
              }
            });
          }

          // -----------------------------
          // จัดการฟอร์ม Signin (สมัครสมาชิกใหม่)
          // -----------------------------
          const signinBtnSubmit = signinForm.querySelector(".yellow-btn");
          
          // ✅ Preview profile image หลังเลือก
          const profileImageInput = document.getElementById("profileImage");
          const profilePreview = document.getElementById("profilePreview");
          
          if (profileImageInput) {
            profileImageInput.addEventListener("change", () => {
              if (profileImageInput.files && profileImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                  profilePreview.src = event.target.result;
                  profilePreview.style.display = "block"; // show preview
                };
                reader.readAsDataURL(profileImageInput.files[0]);
            } else {
                profilePreview.style.display = "none"; // hide if no file
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
              const profileImageInput = document.getElementById("profileImage");

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

              let profileImage =  profilePreview.src||"img/default-avatar.png";
              if (profileImageInput.files && profileImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                  profileImage = event.target.result;
                  saveUser();
                };
                reader.readAsDataURL(profileImageInput.files[0]);
              } else {
                saveUser();
              }

              function saveUser() {
                const newUser = {
                  firstName,
                  lastName,
                  username,
                  password,
                  nickname,
                  email,
                  dateOfBirth,
                  gender,
                  profileImage,
                };

                allUsers.push(newUser);
                localStorage.setItem("users", JSON.stringify(allUsers));

                alert("🎉 สมัครสมาชิกสำเร็จ! ลองล็อกอินได้เลย");
                authModal.classList.remove("show");
                modalContent.innerHTML = "";
              }
            });
          }
        });
    });
  }

  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target.id === "authModal") {
        authModal.classList.remove("show");
        modalContent.innerHTML = "";
      }
    });
  }
}

// -----------------------------
// ฟังก์ชันเมนูมือถือ
// -----------------------------
function setupMobileMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
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

    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("mobile-active");
        navMenu.style.transform = "translateX(100%)";
      });
    });
  }
}

// -----------------------------
// Event หลัก
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupAuthModal();
  setupMobileMenu();

  const header = document.querySelector("header");
  const hero = document.querySelector(".hero");

  window.addEventListener("scroll", () => {
    if (window.scrollY > hero.offsetHeight - 50) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  // -----------------------------
  // Notification Panel (โหลดจาก notify.html)
  // -----------------------------
  const notifyBtn = document.querySelector(".notification-btn");

  if (notifyBtn) {
    notifyBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      // ✅ ตรวจสอบว่ามีผู้ใช้ล็อกอินก่อน
      if (!currentUser) {
        alert("⚠️ กรุณาเข้าสู่ระบบก่อนดูการแจ้งเตือน");
        return;
      }

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

  // -----------------------------
  // Activities Carousel (ลูกศรซ้ายขวา)
  // -----------------------------
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");
  const wrapper = document.querySelector(".activity-cards-wrapper");

  if (leftBtn && rightBtn && wrapper) {
    leftBtn.addEventListener("click", () => {
      wrapper.scrollBy({ left: -300, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      wrapper.scrollBy({ left: 300, behavior: "smooth" });
    });
  }
});
