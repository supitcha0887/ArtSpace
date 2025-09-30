// Import ข้อมูลและ helper functions
import { mockActivities, getActivityById } from './data.js';

// ใช้ข้อมูลชุดเดียวสำหรับทุกอย่าง
const activitiesData = mockActivities;
console.log('Activities Data:', activitiesData);

/* helpers */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const params = new URLSearchParams(location.search);


/* Find Activities → focus search */
const goFind = $('#goFind');
const searchWrap = $('#searchWrap');
const qInput = $('#q');

if (goFind && searchWrap && qInput) {
    goFind.addEventListener('click', () => {
        searchWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => qInput.focus(), 300);
    });
}

/* dropdowns - ส่วน Sort ยังเป็น dropdown */
const sortBtn = $('#btnSort'), sortMenu = $('#menuSort'), sortLabel = $('#sortLabel');

const toggleMenu = (btn, menu) => {
    if (!btn || !menu) return;
    const is = menu.classList.toggle('show');
    if (is) {
        const r = btn.getBoundingClientRect();
        menu.style.minWidth = Math.max(240, r.width) + 'px';
    }
};

if (sortBtn && sortMenu) {
    sortBtn.addEventListener('click', () => toggleMenu(sortBtn, sortMenu));
    document.addEventListener('click', e => {
        if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
            sortMenu.classList.remove('show');
        }
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sortMenu) {
        sortMenu.classList.remove('show');
    }
});

/* Category Select - ใช้ select แทน dropdown */
const categorySelect = $('#category');

/* init state from URL */
if (qInput) {
    qInput.value = params.get('q') || '';
}

const catFromUrl = params.get('category') || '';
if (catFromUrl && categorySelect) {
    categorySelect.value = catFromUrl;
}

// เมื่อเลือก category ใน select
if (categorySelect) {
    categorySelect.addEventListener('change', () => {
        const selectedValue = categorySelect.value;
        if (selectedValue && selectedValue !== 'clear') {
            params.set('category', selectedValue);
        } else {
            params.delete('category');
        }
        history.replaceState(null, '', '?' + params.toString());
        render();
    });
}

/* sorting: 2 choices */
const sortMap = { rating_desc: 'เรตติ้งผู้จัด', date_asc: 'วันที่' };
let sortSel = params.get('sort') || '';

function setSort(v) {
    sortSel = v;
    if (sortLabel) {
        sortLabel.textContent = sortMap[v] || 'เรียงลำดับ';
    }
    $$('#menuSort .sort-btn').forEach(b => b.classList.toggle('is-selected', b.dataset.sort === v));
}

setSort(sortSel);

$$('#menuSort .sort-btn').forEach(b => {
    b.addEventListener('click', () => {
        setSort(b.dataset.sort);
        if (sortMenu) sortMenu.classList.remove('show');
        if (sortSel) {
            params.set('sort', sortSel);
        } else {
            params.delete('sort');
        }
        history.replaceState(null, '', '?' + params.toString());
        render();
    });
});

/* form submit → GET */
const searchForm = $('#searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const next = new URLSearchParams();
        const q = qInput ? qInput.value.trim() : '';
        if (q) next.set('q', q);

        const cat = categorySelect ? categorySelect.value : '';
        if (cat && cat !== 'clear') next.set('category', cat);

        if (sortSel) next.set('sort', sortSel);
        location.assign((location.pathname) + '?' + next.toString());
    });
}

/* regex builder */
function buildRegex(input) {
    const q = input.trim();
    if (!q) return null;
    if (q.startsWith('/') && q.lastIndexOf('/') > 0) {
        const last = q.lastIndexOf('/');
        try {
            return new RegExp(q.slice(1, last), q.slice(last + 1));
        } catch {
            return null;
        }
    }
    return new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

/* filters */
function applyFilters(rows) {
    let out = [...rows];
    const q = params.get('q') || '';
    const re = buildRegex(q);
    if (q && re) {
        out = out.filter(it => re.test(it.title) || re.test(it.host) || re.test(it.description || ''));
    }

    const cat = params.get('category') || '';
    if (cat) out = out.filter(it => it.category === cat);

    switch (sortSel) {
        case 'rating_desc':
            out.sort((a, b) => b.rating - a.rating);
            break;
        case 'date_asc':
            out.sort((a, b) => a.startDate.localeCompare(b.startDate));
            break;
        default:
            out.sort((a, b) => b.startDate.localeCompare(a.startDate));
    }
    return out;
}

/* card render */
const resultsEl = $('#results'), emptyEl = $('#empty');

function fmtDate(s) {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: '2-digit' });
}

function getCategoryIcon(category) {
    const iconMap = {
        'Visual Arts': 'img/VisualArts.png',
        'Photography': 'img/photo.png',
        'Writing': 'img/writ.png',
        'Music': 'img/music.png'
    };
    return iconMap[category] || 'img/default-category.png';
}

// Activity.js
export function card(it) {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="card-body">
      <span class="pill-head"><img src="${getCategoryIcon(it.category)}" alt="" width="16" height="auto"> ${it.category}</span>
      <div class="title-head">${it.title}</div>
      <img class="cover" src="${it.img}" alt="">
      <div class="info-stack">
        <div class="info-row"><img src="img/position.png" class="info-row-image" height="20"> <div class="info-chip">${it.location || it.place}</div></div>
        <div class="info-row"><img src="img/cendle.png" class="info-row-image" height="20"> <div class="info-chip">${fmtDate(it.startDate)}${it.endDate !== it.startDate ? ` - ${fmtDate(it.endDate)}` : ''}</div></div>
        <div class="info-row"><img src="img/time.png" class="info-row-image" height="20"> <div class="info-chip">${it.startTime} - ${it.endTime}</div></div>
      </div>
      <div class="count-badge"><img class="image-count-badge" src="img/account.png" height="18"> ${it.joined}/${it.capacity}</div>
      <div class="org">
        <img src="${it.orgAvatar}" alt="">
        <div>ไอดีผู้จัดกิจกรรม<br>${it.host} · ${it.rating.toFixed(1)} <img class="rating" src="img/star.png"></div>
      </div>
      <div class="actions">
        <button class="btn btn-small btn-ghost moredetail" onclick="openActivityPopup(${it.id})">More Detail</button>
        <button class="btn btn-small btn-dark joinnow btn-join" data-id="${it.id}">Join Now</button>
      </div>
    </div>`;
  return el;
}

function render() {
    if (!resultsEl) {
        console.error('Results element not found');
        return;
    }
    
    const rows = applyFilters(activitiesData);
    resultsEl.innerHTML = '';
    
    if (!rows.length) {
        if (emptyEl) emptyEl.style.display = 'grid';
        return;
    }
    
    if (emptyEl) emptyEl.style.display = 'none';
    rows.forEach(r => resultsEl.appendChild(card(r)));
}

// เรียกใช้ render เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, rendering activities...');
    render();
});

/* JOIN modal + validate */
const modalJoin = $('#joinModal'), joinId = $('#joinActivityId'), joinName = $('#joinName'), joinEmail = $('#joinEmail');
const errName = $('#errName'), errEmail = $('#errEmail'), joinSubmit = $('#joinSubmit');
const NAME_RE = /^[A-Za-zก-๙\s]{2,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function openJoinModal(id) {
    if (!modalJoin) {
        alert(`สมัครเข้าร่วมกิจกรรม ID: ${id}`);
        return;
    }
    
    if (joinId) joinId.value = String(id);
    if (joinName) joinName.value = '';
    if (joinEmail) joinEmail.value = '';
    if (errName) errName.classList.remove('show');
    if (errEmail) errEmail.classList.remove('show');
    if (joinSubmit) joinSubmit.disabled = true;
    
    modalJoin.classList.remove('hidden');
    modalJoin.setAttribute('aria-hidden', 'false');
    if (joinName) joinName.focus();
}

function closeJoinModal() {
    if (modalJoin) {
        modalJoin.classList.add('hidden');
        modalJoin.setAttribute('aria-hidden', 'true');
    }
}

/* Activity Detail Popup */
window.openActivityPopup = function(id) {
    const activity = getActivityById(id);
    if (!activity) {
        console.error('ไม่พบข้อมูลกิจกรรม ID:', id);
        return;
    }
    
    // เรียกใช้ function จาก MoredetailActivity-popup.js
    if (typeof window.openActivityPopup !== 'undefined') {
        window.openActivityPopup(id);
    } else {
        // fallback ถ้าไม่มี popup script
        alert(`แสดงรายละเอียด: ${activity.title}\n${activity.description}`);
    }
};

/* CREATE modal */
const modalCreate = $('#createModal');

function openCreate() {
    if (modalCreate) {
        document.body.classList.add('modal-open');
        modalCreate.classList.remove('hidden');
    }
}

function closeCreate() {
    if (modalCreate) {
        document.body.classList.remove('modal-open');
        modalCreate.classList.add('hidden');
    }
}

const openCreate2 = $('#openCreate2');
if (openCreate2) {
    openCreate2.addEventListener('click', openCreate);
}

if (modalCreate) {
    modalCreate.addEventListener('click', e => {
        if (e.target.classList.contains('modal-backdrop')) closeCreate();
    });
}

// ทำให้ข้อมูลเป็น global สำหรับ popup scripts
window.mockActivitiesDetail = mockActivities.reduce((acc, activity) => {
    acc[activity.id] = activity;
    return acc;
}, {});

console.log('Activity.js loaded successfully', { 
    activitiesCount: activitiesData.length,
    resultsElement: !!resultsEl 
});