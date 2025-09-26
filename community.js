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


// ===== Filtering & Search =====
(function(){
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const postList = document.getElementById("postList");
  const resultMeta = document.getElementById("resultMeta");
  const clearBtn = document.getElementById("clearSearchBtn");
  if (!postList) return;

  function normalize(t){ return (t || "").toString().toLowerCase().trim(); }
  function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // เก็บข้อความต้นฉบับไว้ครั้งเดียว
  function stashOriginal(node){
    if (!node) return;
    if (!node.dataset.orig) node.dataset.orig = node.innerHTML;
  }
  function restoreOriginal(node){
    if (!node) return;
    if (node.dataset.orig) node.innerHTML = node.dataset.orig;
  }
  function highlightIn(node, q){
    if (!node) return;
    const orig = node.dataset.orig || node.innerHTML;
    if (!q) { node.innerHTML = orig; return; }
    const re = new RegExp("(" + escapeRegExp(q) + ")", "gi");
    node.innerHTML = orig.replace(re, '<mark class="search-hit">$1</mark>');
  }

  // เตรียม stash ให้ทุกโพสต์
  postList.querySelectorAll(".post-item").forEach((el)=>{
    stashOriginal(el.querySelector(".post-title a"));
    stashOriginal(el.querySelector(".post-desc"));
    stashOriginal(el.querySelector(".post-author"));
  });

  function matchesQuery(el, q){
    if (!q) return true;
    const title = el.querySelector(".post-title")?.innerText || "";
    const desc = el.querySelector(".post-desc")?.innerText || "";
    const author = el.querySelector(".post-author")?.innerText || "";
    const hay = (title + " " + desc + " " + author).toLowerCase();
    return hay.includes(q);
  }

  function matchesCategory(el, cat){
    if (!cat || cat === "all") return true;
    return (el.getAttribute("data-category") || "").toLowerCase() === cat.toLowerCase();
  }

  function renderHighlights(q){
    // คืนค่าข้อความเดิมก่อนทุกครั้ง ป้องกันการห่อซ้ำ
    postList.querySelectorAll(".post-item").forEach((el)=>{
      restoreOriginal(el.querySelector(".post-title a"));
      restoreOriginal(el.querySelector(".post-desc"));
      restoreOriginal(el.querySelector(".post-author"));
    });

    if (!q) return;

    // ไฮไลท์เฉพาะที่มองเห็น (ผ่านฟิลเตอร์แล้ว)
    postList.querySelectorAll(".post-item:not(.hidden)").forEach((el)=>{
      highlightIn(el.querySelector(".post-title a"), q);
      highlightIn(el.querySelector(".post-desc"), q);
      highlightIn(el.querySelector(".post-author"), q);
    });
  }

  function applyFilters(){
    const q = normalize(searchInput?.value || "");
    const cat = categorySelect?.value || "all";
    let shown = 0;
    postList.querySelectorAll(".post-item").forEach((el)=>{
      const ok = matchesQuery(el, q) && matchesCategory(el, cat);
      el.classList.toggle("hidden", !ok);
      if (ok) shown++;
    });
    if (resultMeta) resultMeta.textContent = `พบ ${shown} โพสต์`;
    renderHighlights(q);
  }

  searchInput?.addEventListener("input", applyFilters);
  categorySelect?.addEventListener("change", applyFilters);
  clearBtn?.addEventListener("click", ()=>{
    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "all";
    applyFilters();
  });

  // initial count + clear highlight
  applyFilters();
})();
