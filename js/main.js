// ===========================
// GLOBAL JS - GymShape UI
// ===========================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.background = 'rgba(10, 12, 20, 0.97)';
      } else {
        navbar.style.background = 'rgba(10, 12, 20, 0.85)';
      }
    });
  }

  // --- Active nav link highlight ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Animate elements on scroll ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // --- Ripple effect on buttons ---
  document.querySelectorAll('.btn, .btn-appointment').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple animation
  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
  document.head.appendChild(style);

  // --- Form validation utility ---
  window.validateForm = function(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
        valid = false;
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }, 2500);
      }
    });
    return valid;
  };

  // --- Toast notification utility ---
  window.showToast = function(message, type = 'success') {
    const colors = {
      success: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' },
      error:   { bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.3)',  text: '#f87171' },
      info:    { bg: 'rgba(37, 99, 235, 0.12)',   border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' }
    };
    const c = colors[type] || colors.info;
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 9999;
      background: ${c.bg}; border: 1px solid ${c.border}; color: ${c.text};
      padding: 14px 22px; border-radius: 10px; font-family: 'Exo 2', sans-serif;
      font-size: 0.9rem; font-weight: 600;
      backdrop-filter: blur(12px); box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      animation: toastIn 0.4s ease; display: flex; align-items: center; gap: 8px;
    `;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
    document.body.appendChild(toast);

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes toastIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes toastOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(20px); } }
    `;
    document.head.appendChild(styleEl);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.4s ease forwards';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };

  // --- Counter animation ---
  window.animateCounter = function(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
      else el.textContent = Math.floor(start).toLocaleString();
    }, 16);
  };

  // Animate any [data-counter] elements when visible
  document.querySelectorAll('[data-counter]').forEach(el => {
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, parseInt(el.dataset.counter));
        counterObserver.unobserve(el);
      }
    });
    counterObserver.observe(el);
  });

});

document.addEventListener('DOMContentLoaded', () => {

  // --- EXISTING CODE ABOVE ---

  // --- Payment Method Tabs ---
  const cardForm = document.getElementById('cardForm');
  const ewalletForm = document.getElementById('ewalletForm');
  const ewalletImage = document.querySelector('#ewalletForm img');
  const ewalletText = document.getElementById('ewalletText');

  // FIX: Correct image paths for GitHub Pages (payment.html is inside /pages)
const wallets = {
  gcash: {
    img: '../Images/Gcash.png', // correct relative path
    text: 'Enter your registered GCash number.'
  },
  maya: {
    img: '../Images/Maya.png', // correct relative path
    text: 'Enter your registered Maya number.'
  }
};


  window.selectMethod = function(tabElement, method) {
    // Remove active class from all tabs
    document.querySelectorAll('.method-tab').forEach(tab => tab.classList.remove('active'));
    // Add active class to clicked tab
    tabElement.classList.add('active');

    // Show/hide forms
    if (method === 'card') {
      cardForm.style.display = 'block';
      ewalletForm.style.display = 'none';
    } else if (wallets[method]) {
      cardForm.style.display = 'none';
      ewalletForm.style.display = 'block';
      ewalletImage.src = wallets[method].img;
      ewalletText.textContent = wallets[method].text;
    }
  };

  // --- Payment Button Handler ---
  window.handlePayment = function() {
    const activeTab = document.querySelector('.method-tab.active');
    if (!activeTab) {
      showToast('Please select a payment method.', 'error');
      return;
    }
    // Get method from tab's onclick attribute
    const onclickAttr = activeTab.getAttribute('onclick');
    const methodMatch = onclickAttr.match(/'(\w+)'/);
    const method = methodMatch ? methodMatch[1] : null;

    if (!method) return;

    if (method === 'card') {
      // You can add credit card validation here
      showToast('Processing credit card payment...', 'info');
    } else {
      const mobileInput = ewalletForm.querySelector('input[type="tel"]');
      if (!mobileInput.value.trim()) {
        showToast('Please enter your mobile number.', 'error');
        return;
      }
      showToast(`Processing ${method.toUpperCase()} payment for ${mobileInput.value}...`, 'success');
    }
  };

  // --- OPTIONAL: Initialize default tab ---
  const defaultTab = document.querySelector('.method-tab.active');
  if (defaultTab) {
    const onclickAttr = defaultTab.getAttribute('onclick');
    const methodMatch = onclickAttr.match(/'(\w+)'/);
    const method = methodMatch ? methodMatch[1] : null;
    if (method) selectMethod(defaultTab, method);
  }

});
