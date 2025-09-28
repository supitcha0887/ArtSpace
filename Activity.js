/* helpers */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const params = new URLSearchParams(location.search);



/* Find Activities → focus search */
$('#goFind').addEventListener('click', () => {
    $('#searchWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => $('#q').focus(), 300);
});

/* dropdowns - ส่วน Sort ยังเป็น dropdown */
const sortBtn = $('#btnSort'), sortMenu = $('#menuSort'), sortLabel = $('#sortLabel');
const toggleMenu = (btn, menu) => {
    const is = menu.classList.toggle('show');
    if (is) {
        const r = btn.getBoundingClientRect();
        menu.style.minWidth = Math.max(240, r.width) + 'px';
    }
};

sortBtn.addEventListener('click', () => toggleMenu(sortBtn, sortMenu));
document.addEventListener('click', e => {
    if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) sortMenu.classList.remove('show');
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        sortMenu.classList.remove('show');
    }
});

/* Category Select - ใช้ select แทน dropdown */
const categorySelect = $('#category');

/* init state from URL */
const qInput = $('#q');
qInput.value = params.get('q') || '';

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
    sortLabel.textContent = sortMap[v] || 'เรียงลำดับ';
    $$('#menuSort .sort-btn').forEach(b => b.classList.toggle('is-selected', b.dataset.sort === v));
}
setSort(sortSel);
$$('#menuSort .sort-btn').forEach(b => b.addEventListener('click', () => {
    setSort(b.dataset.sort);
    sortMenu.classList.remove('show');
    params.set('sort', sortSel);
    history.replaceState(null, '', '?' + params.toString());
    render();
}));

/* form submit → GET */
$('#searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const next = new URLSearchParams();
    const q = qInput.value.trim();
    if (q) next.set('q', q);

    const cat = categorySelect ? categorySelect.value : '';
    if (cat && cat !== 'clear') next.set('category', cat);

    if (sortSel) next.set('sort', sortSel);
    location.assign((location.pathname) + '?' + next.toString());
});

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
        out = out.filter(it => re.test(it.title) || re.test(it.host));
    }

    const cat = params.get('category') || '';
    if (cat) out = out.filter(it => it.category === cat);

    switch (sortSel) {
        case 'rating_desc':
            out.sort((a, b) => b.rating - a.rating);
            break;
        case 'date_asc':
            out.sort((a, b) => a.dateStart.localeCompare(b.dateStart));
            break;
        default:
            out.sort((a, b) => b.dateStart.localeCompare(a.dateStart));
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
        'Visual Arts': '/img/VisualArts.png',
        'Photography': '/img/photo.png',
        'Writing': '/img/writ.png',
        'Music': '/img/music.png'
    };
    return iconMap[category] || '/img/default-category.png'; // fallback icon
}

function card(it) {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
    <div class="card-body">
      <span class="pill-head"><img src="${getCategoryIcon(it.category)}" alt="" width="16" height="auto"> ${it.category}</span>
      <div class="title-head">${it.title}</div>
      <img class="cover" src="${it.img}" alt="">
      <div class="info-stack">
        <div class="info-row"><img src="/img/position.png" class="info-row-image" width="auto" height="20" alt=""><div class="info-chip">${it.place}</div></div>
        <div class="info-row"><img src="/img/cendle.png" class="info-row-image" width="auto" height="20" alt=""><div class="info-chip">${fmtDate(it.dateStart)}${it.dateEnd !== it.dateStart ? ` - ${fmtDate(it.dateEnd)}` : ''}</div></div>
        <div class="info-row"><img src="/img/time.png" class="info-row-image" width="auto" height="20" alt=""><div class="info-chip">${it.time}</div></div>
      </div>
      <div class="count-badge"><img class="image-count-badge" src="/img/account.png" width="18" height="18" alt=""> ${it.joined}/${it.capacity}</div>
      <div class="org">
        <img src="${it.orgAvatar}" alt="">
        <div>ไอดีผู้จัดกิจกรรม<br>${it.host} · ${it.rating.toFixed(1)} <img class="rating" src="/img/star.png"> </div>
      </div>
      <div class="actions">
        <button class="btn btn-small btn-ghost moredetail" href="detail.html?id=${it.id}">More Detail</button>
        <button class="btn btn-small btn-dark joinnow btn-join" data-id="${it.id}">Join Now</button>
      </div>
    </div>`;
    el.querySelector('.btn-join').addEventListener('click', () => openJoinModal(it.id));
    return el;
}

function render() {
    const rows = applyFilters(window.MOCK || []);
    resultsEl.innerHTML = '';
    if (!rows.length) {
        emptyEl.style.display = 'grid';
        return;
    }
    emptyEl.style.display = 'none';
    rows.forEach(r => resultsEl.appendChild(card(r)));
}

// เรียกใช้ render เมื่อโหลดหน้า
render();

/* JOIN modal + validate */
const modalJoin = $('#joinModal'), joinId = $('#joinActivityId'), joinName = $('#joinName'), joinEmail = $('#joinEmail');
const errName = $('#errName'), errEmail = $('#errEmail'), joinSubmit = $('#joinSubmit');
const NAME_RE = /^[A-Za-zก-๙\s]{2,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function openJoinModal(id) {
    joinId.value = String(id);
    joinName.value = '';
    joinEmail.value = '';
    errName.classList.remove('show');
    errEmail.classList.remove('show');
    joinSubmit.disabled = true;
    modalJoin.classList.remove('hidden');
    modalJoin.setAttribute('aria-hidden', 'false');
    joinName.focus();
}

function closeJoinModal() {
    modalJoin.classList.add('hidden');
    modalJoin.setAttribute('aria-hidden', 'true');
}
// const modalJoin = $('#joinModal');
// if (modalJoin) {
//     $('#joinClose').addEventListener('click', closeJoinModal);
//     $('#joinCancel').addEventListener('click', closeJoinModal);
//     modalJoin.addEventListener('click', e => {
//         if (e.target.classList.contains('modal-backdrop')) closeJoinModal();
//     });

//     function validateJoin() {
//         const okN = NAME_RE.test(joinName.value.trim());
//         const okE = EMAIL_RE.test(joinEmail.value.trim());
//         errName.classList.toggle('show', !okN && joinName.value.trim() !== '');
//         errEmail.classList.toggle('show', !okE && joinEmail.value.trim() !== '');
//         joinSubmit.disabled = !(okN && okE);
//     }

//     ['input', 'blur'].forEach(ev => {
//         joinName.addEventListener(ev, validateJoin);
//         joinEmail.addEventListener(ev, validateJoin);
//     });

//     $('#joinForm').addEventListener('submit', e => {
//         e.preventDefault();
//         location.assign(`join.html?id=${encodeURIComponent(joinId.value)}&name=${encodeURIComponent(joinName.value)}&email=${encodeURIComponent(joinEmail.value)}`);
//     });
// }

/* CREATE modal — lock scroll while open */
const modalCreate = $('#createModal');
function openCreate() {
    document.body.classList.add('modal-open');
    modalCreate.classList.remove('hidden');
}
function closeCreate() {
    document.body.classList.remove('modal-open');
    modalCreate.classList.add('hidden');
}

$('#openCreate2').addEventListener('click', openCreate);
modalCreate.addEventListener('click', e => {
    if (e.target.classList.contains('modal-backdrop')) closeCreate();
});