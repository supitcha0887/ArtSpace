// community.js (enhanced: filter by category + live search highlight)
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Helpers ----------
  const getLoggedInUser = () =>
    JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const postList = document.getElementById("postList");
  const openPostModal = document.getElementById("openPostModal");
  const postModalContainer = document.getElementById("postModalContainer");
  const categorySelect = document.getElementById("categorySelect");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.querySelector(".search-btn");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const resultMeta = document.getElementById("resultMeta");

  // เก็บ HTML ตัวอย่างที่ฮาร์ดโค้ดไว้ เพื่อไม่ให้หายเวลา render ใหม่
  const defaultListHTML = postList ? postList.innerHTML : "";

  // ---------- UX utils ----------
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function clearHighlights(root) {
    if (!root) return;
    root.querySelectorAll("mark.search-hit").forEach((m) => {
      const text = document.createTextNode(m.textContent);
      m.replaceWith(text);
    });
  }

  function highlightInNode(el, term) {
    // ทำเฉพาะ textNode ของเป้าหมายที่ควบคุมได้ เพื่อลดผลข้างเคียงกับ HTML ภายใน
    if (!el || !term) return;
    const t = el.textContent;
    if (!t) return;
    const re = new RegExp(escapeRegExp(term), "gi");
    const replaced = t.replace(re, (m) => `<mark class="search-hit">${m}</mark>`);
    if (replaced !== t) el.innerHTML = replaced;
  }

  function updateVisibleCount() {
    if (!postList || !resultMeta) return;
    const visible = postList.querySelectorAll(".post-item:not(.hidden)").length;
    resultMeta.textContent = `พบ ${visible} โพสต์`;
  }

  function matchesQuery(el, q) {
    if (!q) return true;
    const title = el.querySelector(".post-title a")?.textContent || "";
    const desc = el.querySelector(".post-desc")?.textContent || "";
    const author = el.querySelector(".post-author strong")?.textContent || "";
    const hay = (title + " " + desc + " " + author).toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function applyFilters() {
    if (!postList) return;

    const q = (searchInput?.value || "").trim();
    const cat = categorySelect?.value || "all";

    // ล้างไฮไลท์ทั้งหมดก่อน
    postList.querySelectorAll(".post-item").forEach((card) => {
      clearHighlights(card);
      card.classList.remove("hidden");
    });

    // กรอง + ไฮไลท์
    postList.querySelectorAll(".post-item").forEach((card) => {
      const cardCat = (card.getAttribute("data-category") || "").toLowerCase();
      const passCat = cat === "all" || cardCat === cat.toLowerCase();
      const passQ = matchesQuery(card, q);

      // ซ่อนถ้าไม่ผ่านอย่างใดอย่างหนึ่ง
      if (!passCat || !passQ) {
        card.classList.add("hidden");
        return;
      }

      // ไฮไลท์เฉพาะที่แสดง
      if (q) {
        const titleA = card.querySelector(".post-title a");
        const descP = card.querySelector(".post-desc");
        const authorStrong = card.querySelector(".post-author strong");
        // ใช้ innerHTML กับ target ที่เป็นข้อความล้วน
        if (titleA) highlightInNode(titleA, q);
        if (descP) highlightInNode(descP, q);
        if (authorStrong) highlightInNode(authorStrong, q);
      }
    });

    updateVisibleCount();
  }

  // ปุ่ม New Post: เปิด/ปิดตามสถานะล็อกอิน
  function toggleNewPostBtn() {
    const u = getLoggedInUser();
    if (!openPostModal) return;
    openPostModal.disabled = !u;
    openPostModal.classList.toggle("is-disabled", !u);
    openPostModal.title = u ? "" : "กรุณาล็อกอินก่อนโพสต์";
  }
  toggleNewPostBtn();

  // ถ้ามีปุ่ม logout ใน navbar ให้รีเฟรชสถานะปุ่มทันทีที่คลิก
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setTimeout(toggleNewPostBtn, 0);
      setTimeout(applyFilters, 0);
    });
  }

  // ถ้ามีการเปลี่ยน localStorage จากแท็บอื่น ๆ
  window.addEventListener("storage", (e) => {
    if (e.key === "loggedInUser" || e.key === "customPosts") {
      toggleNewPostBtn();
      renderExistingPosts();
      applyFilters();
    }
  });

  // ---------- Render list ----------
  function addPostCard(p) {
    if (!postList) return;
    const el = document.createElement("div");
    el.className = "post-item";
    el.setAttribute("data-category", (p.category || "ทั่วไป").toLowerCase());

    const preview =
      (p.content || "").slice(0, 140) +
      ((p.content || "").length > 140 ? "..." : "");

    el.innerHTML = `
      <span class="badge">${p.category || "ทั่วไป"}</span>
      <h3 class="post-title"><a href="post.html?id=${p.id}">${p.title}</a></h3>
      <p class="post-desc">${preview}</p>
      <span class="post-author">โพสต์โดย: <strong>${p.author || "ไม่ระบุ"}</strong></span>
      <button class="delete-btn" data-id="${p.id}" style="margin-top:8px;border:none;background:#eee;padding:8px 10px;border-radius:8px;cursor:pointer">ลบโพสต์</button>
    `;
    // โพสต์ใหม่อยู่บน
    postList.prepend(el);
  }

  function renderExistingPosts() {
    if (!postList) return;
    const customPosts = JSON.parse(localStorage.getItem("customPosts") || "[]");
    // คืน HTML ตัวอย่างก่อน แล้วค่อยเติมโพสต์ผู้ใช้
    postList.innerHTML = defaultListHTML;

    // ทำให้ data-category ของตัวอย่างเป็นตัวพิมพ์เล็ก เพื่อเทียบง่าย
    postList.querySelectorAll(".post-item").forEach((d) => {
      const c = (d.getAttribute("data-category") || "").toLowerCase();
      if (c) d.setAttribute("data-category", c);
    });

    customPosts
      .sort((a, b) => Number(b.id) - Number(a.id))
      .forEach(addPostCard);

    updateVisibleCount();
  }
  renderExistingPosts();

  // ---------- Delete (event delegation) ----------
  if (postList) {
    postList.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;
      const id = btn.dataset.id;
      if (!confirm("ยืนยันลบโพสต์นี้?")) return;

      const customPosts = JSON.parse(localStorage.getItem("customPosts") || "[]");
      const next = customPosts.filter((p) => String(p.id) !== String(id));
      localStorage.setItem("customPosts", JSON.stringify(next));

      const card = btn.closest(".post-item");
      if (card) card.remove();
      updateVisibleCount();
    });
  }

  // ---------- Open modal & submit ----------
  if (openPostModal && postModalContainer) {
    openPostModal.addEventListener("click", async () => {
      const loggedInUser = getLoggedInUser(); // อ่านสดใหม่ทุกครั้ง
      if (!loggedInUser) {
        alert("กรุณาล็อกอินก่อนจึงจะสามารถโพสต์ได้");
        toggleNewPostBtn();
        return;
      }

      // โหลดเทมเพลตโมดอล
      postModalContainer.innerHTML = "";
      const html = await fetch("CreateCommunity.html").then((r) => r.text());
      postModalContainer.innerHTML = html;

      const modal = document.getElementById("postModal");
      const closeBtn = document.getElementById("closePostModal");
      const cancelBtn = document.getElementById("cancelPost");
      const form = postModalContainer.querySelector(".post-form");

      const close = () => (modal.style.display = "none");
      modal.style.display = "flex";
      if (closeBtn) closeBtn.onclick = close;
      if (cancelBtn) cancelBtn.onclick = close;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });

      // ===== รองรับอัปโหลดรูป (เก็บเป็น Data URL) =====
      let coverDataUrl = "";
      const fileInput =
        postModalContainer.querySelector("#uploadInput") ||
        postModalContainer.querySelector('input[type="file"]');

      if (fileInput) {
        fileInput.addEventListener("change", () => {
          const f = fileInput.files?.[0];
          if (!f) {
            coverDataUrl = "";
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            coverDataUrl = e.target.result; // data:image/...
          };
          reader.readAsDataURL(f);
        });
      }

      // ส่งฟอร์ม
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // กันกรณีล็อกเอาท์ระหว่างเปิดฟอร์ม
        const u = getLoggedInUser();
        if (!u) {
          alert("เซสชันหมดอายุ กรุณาล็อกอินอีกครั้ง");
          toggleNewPostBtn();
          close();
          return;
        }

        // รองรับทั้ง name= และ id= จากเทมเพลต
        const topic =
          form.topic?.value?.trim() ??
          document.getElementById("topic")?.value?.trim() ??
          "";
        const category =
          (form.category?.value ??
            document.getElementById("category")?.value ??
            "ทั่วไป").toLowerCase();
        const detail =
          form.detail?.value?.trim() ??
          document.getElementById("detail")?.value?.trim() ??
          "";
        // ถ้ามีช่องกรอก URL รูป ให้ใช้ก่อน
        const coverUrl =
          form.cover?.value?.trim?.() ??
          document.getElementById("coverUrl")?.value?.trim?.() ??
          "";

        const id = Date.now();
        const nickname = u.nickname || u.username || "ไม่ระบุ";

        const customPosts = JSON.parse(localStorage.getItem("customPosts") || "[]");
        const newPost = {
          id,
          title: topic || "(ไม่มีหัวข้อ)",
          content: detail,
          author: nickname,
          cover: coverUrl || coverDataUrl || "", // ใช้ URL ถ้ามี ไม่งั้นใช้รูปอัปโหลด
          category,
        };
        customPosts.push(newPost);
        localStorage.setItem("customPosts", JSON.stringify(customPosts));

        addPostCard(newPost);
        applyFilters(); // ให้โพสต์ใหม่ถูกกรอง/ไฮไลท์ตามคิวรีปัจจุบัน
        form.reset();
        close();
      });
    });
  }

  // ---------- Filtering & Search bindings ----------
  if (categorySelect) {
    categorySelect.addEventListener("change", applyFilters);
  }
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categorySelect) categorySelect.value = "all";
      applyFilters();
    });
  }

  // เรียกครั้งแรกเพื่ออัปเดตตัวเลขและสถานะ
  applyFilters();
});
