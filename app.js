// -----------------------------
// เก็บบัญชีตัวอย่าง (fix) + สถานะล็อกอิน
// -----------------------------
const users = [
  {
    username: "admin",
    password: "admin",
    avatar:
      "https://media.canva.com/v2/image-resize/format:JPG/height:200/quality:75/uri:ifs%3A%2F%2FM%2Fd4b7d9ec-1765-447f-a5fe-cffaed22afc0/watermark:F/width:150?csig=AAAAAAAAAAAAAAAAAAAAAFGQ61tci8LPSMvMpRM93Tk99vLRpADv-Feq4rXccTYs&exp=1758379348&osig=AAAAAAAAAAAAAAAAAAAAALlrCDbmZiFzKKeQgop9l0WMJ4BJNwMUV5UlqG0hiGqw&signer=media-rpc&x-canva-quality=thumbnail",
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

                const userInfo = document.getElementById("userInfo");
                const userAvatar = document.getElementById("userAvatar");
                const userName = document.getElementById("userName");
                const loginBtn = document.querySelector(".login-btn");

                if (userInfo && userAvatar && userName && loginBtn) {
                  userAvatar.src = user.avatar || "img/default-avatar.png";
                  userName.textContent = user.username;
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
          if (signinBtnSubmit) {
            signinBtnSubmit.addEventListener("click", (e) => {
              e.preventDefault();

              const username = document
                .getElementById("signinUsername")
                .value.trim();
              const password = document
                .getElementById("signinPassword")
                .value.trim();
              const profilePicInput =
                document.getElementById("profile-picture");

              if (!username || !password) {
                alert("❌ กรุณากรอก Username และ Password");
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

              let avatar = "img/default-avatar.png";
              if (profilePicInput.files && profilePicInput.files[0]) {
                avatar = URL.createObjectURL(profilePicInput.files[0]);
              }

              allUsers.push({ username, password, avatar });
              localStorage.setItem("users", JSON.stringify(allUsers));

              alert("🎉 สมัครสมาชิกสำเร็จ! ลองล็อกอินได้เลย");
              authModal.classList.remove("show");
              modalContent.innerHTML = "";
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
      if (navMenu.classList.contains("mobile-active")) {
        navMenu.style.transform = "translateX(0)";
      } else {
        navMenu.style.transform = "translateX(100%)";
      }
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
  //setupLogout();

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
