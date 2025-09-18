const burger = document.getElementById('burger');
const menu = document.getElementById('main-menu');
const overlay = document.getElementById('nav-overlay');
const closeBtn = document.getElementById('menu-close');

function openMenu(){
  menu.classList.add('is-open');
  overlay.hidden = false;
  requestAnimationFrame(()=> overlay.style.opacity = '1');
  burger.setAttribute('aria-expanded','true');
  document.body.classList.add('menu-open');    
}
function closeMenu(){
  menu.classList.remove('is-open');
  overlay.style.opacity = '0';
  burger.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');  
  setTimeout(()=> overlay.hidden = true, 250);
}

if (burger && menu && overlay) {
  burger.addEventListener('click', () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  menu.addEventListener('click', e => {
    if (e.target.closest('a') && window.matchMedia('(max-width:1279px)').matches) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}

function ensureToast() {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);


    Object.assign(toast.style, {
      position: 'fixed',
      top: '24px',                 
      left: '50%',
      transform: 'translateX(-50%) translateY(-100%)',
      background: '#1a1f2c',
      color: '#ffffff',
      padding: '14px 20px',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '15px',
      boxShadow: '0 8px 22px rgba(0,0,0,.45)',
      opacity: '0',
      transition: 'all .4s ease',
      zIndex: '10000',
      pointerEvents: 'none'
    });
  }
  return toast;
}

function showToastTop(message = 'Готово', variant = 'success') {
  const toast = ensureToast();
  toast.textContent = message;

  if (variant === 'success') {
    toast.style.background = '#1f3a2a';
    toast.style.color = '#d7ffe4';
  } else if (variant === 'error') {
    toast.style.background = '#3a1f24';
    toast.style.color = '#ffd7df';
  } else {
    toast.style.background = '#1a1f2c';
    toast.style.color = '#ffffff';
  }

  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';


  clearTimeout(showToastTop._t);
  showToastTop._t = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-100%)';
  }, 3000);
}


document.addEventListener('click', e => {
  const btn = e.target.closest('[data-modal-target]');
  if (!btn) return;
  const sel = btn.getAttribute('data-modal-target');
  const gig = btn.getAttribute('data-gig');
  if (gig) {
    const lbl = document.getElementById('gigLabel');
    if (lbl) lbl.textContent = 'Обраний концерт: ' + gig;
  }
  const dlg = document.querySelector(sel);
  if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
});

(() => {
  const ticketModal = document.getElementById('ticketModal');
  if (!ticketModal) return;

  ticketModal.addEventListener('close', () => {
    if (ticketModal.returnValue === 'ok') {
      showToastTop('Квиток замовлено ✅', 'success');
    }
  });
})();

const contactForm = document.getElementById('contactForm');

const EMAIL_ASCII = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const HAS_NON_ASCII = /[^\x00-\x7F]/;

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    const f = e.target;

    const name = f.name.value.trim();
    const email = f.email.value.trim();
    const msg = f.message.value.trim();

    const setErr = (field, text) => {
      const box = document.querySelector(`[data-error-for="${field}"]`);
      if (box) box.textContent = text || '';
    };

    if (name.length < 2) { setErr('name', 'Мінімум 2 символи'); ok = false; } else setErr('name', '');

    if (HAS_NON_ASCII.test(email) || !EMAIL_ASCII.test(email)) {
      setErr('email', 'example@gmail.com');
      ok = false;
    } else setErr('email', '');

    if (msg.length < 5) { setErr('message', 'Мінімум 5 символів'); ok = false; } else setErr('message', '');

    if (!ok) return;

    const params = new URLSearchParams(new FormData(f)).toString();
    const url = `${window.location.pathname}?${params}#contacts`;

    try { await fetch(`${window.location.pathname}?${params}`, { method: 'GET', keepalive: true }); } catch {}

    history.replaceState(null, '', url);
    showToastTop('Повідомлення надіслано ✅', 'success');
    f.reset();
  });
}