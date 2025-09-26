document.addEventListener("DOMContentLoaded", () => {
    // ✅ ดึงข้อมูลผู้ใช้ที่ล็อกอินจาก localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");
    const loginBtn = document.querySelector(".login-btn");

    if (loggedInUser) {
      userInfo.style.display = "flex";
      userName.textContent = loggedInUser.nickname || loggedInUser.username;
      userAvatar.src = loggedInUser.profileImage || "img/default-avatar.png";
      loginBtn.style.display = "none";
    }

    // ✅ เปิด modal สร้างโพสต์
    const openPostModal = document.getElementById("openPostModal");
    const postModalContainer = document.getElementById("postModalContainer");

    openPostModal.addEventListener("click", async () => {
      if (!loggedInUser) {
        alert("กรุณาล็อกอินก่อนจึงจะสามารถโพสต์ได้");
        return;
      }

      const response = await fetch("CreateCommunity.html");
      const html = await response.text();
      postModalContainer.innerHTML = html;

      document.getElementById("postModal").style.display = "block";

      // ปิด modal
      document.getElementById("closePostModal").onclick = () => {
        document.getElementById("postModal").style.display = "none";
      };
      document.getElementById("cancelPost").onclick = () => {
        document.getElementById("postModal").style.display = "none";
      };

      // ✅ handle submit
      const form = postModalContainer.querySelector(".post-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const topic = form.topic.value;
        const category = form.category.value;
        const detail = form.detail.value;

        const nickname = loggedInUser.nickname || loggedInUser.username;
        const avatar = loggedInUser.profileImage || "img/default-avatar.png";

        const postList = document.getElementById("postList");
        const newPost = document.createElement("div");
        newPost.classList.add("post-item");
        newPost.setAttribute("data-category", category);

        newPost.innerHTML = `
          <h3 class="post-title"><a href="#">${topic}</a></h3>
          <p class="post-desc">${detail}</p>
          <span class="post-author">
            <img src="${avatar}">
            โพสต์โดย: <strong>${nickname}</strong>
          </span>
          <button class="delete-btn">ลบโพสต์</button>
        `;

        // ✅ ปุ่มลบ
        newPost.querySelector(".delete-btn").addEventListener("click", () => {
          newPost.remove();
        });

        postList.prepend(newPost);
        document.getElementById("postModal").style.display = "none";
      });
    });
  });
