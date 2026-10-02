/* ==========================================================================
   MAIN JAVASCRIPT - DREAMY KAWAII STORYBOOK PORTFOLIO
   Phạm Thị Thanh Ngọc - Gia Sư Toán
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-item a');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const toast = document.getElementById('sweet-toast');
  const toastMsg = document.getElementById('toast-message');
  const rippleContainer = document.getElementById('ripple-container');

  // Modals
  const cvModal = document.getElementById('cv-modal');
  const openCvBtns = document.querySelectorAll('.open-cv-btn');
  const closeCvBtn = document.getElementById('close-cv-btn');

  // Animal Companions
  const heroBunny = document.getElementById('hero-bunny');
  const bunnySpeech = document.getElementById('bunny-speech');
  const cheeringCat = document.querySelector('.cheering-cat');


  // ==========================================
  // 1. TYPING EFFECT IN HERO
  // ==========================================
  const typingElement = document.getElementById('typing-text');
  const phrases = [
    'Gia sư Toán tận tâm',
    'THPTQG 2025: Vật lý 10, toán 9,5',
    'Sinh viên ĐH Ngoại Thương',
    'Đồng hành bứt phá điểm số',
    'Tận tình • Kiên nhẫn • Thấu hiểu'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typingElement) return;
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // Pause before next
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();

  // ==========================================
  // 2. SQUISHY BUBBLE & CLICK PARTICLES
  // ==========================================
  document.addEventListener('click', (e) => {
    // Generate floating bubble & star at click coordinate
    createClickBubble(e.clientX, e.clientY);
    createClickStars(e.clientX, e.clientY);

    // Play bubble pop sound if available
    if (typeof KawaiiAudio !== 'undefined') {
      KawaiiAudio.playBubblePop();
    }
  });

  function createClickBubble(x, y) {
    if (!rippleContainer) return;
    const bubble = document.createElement('div');
    bubble.className = 'click-bubble';
    const size = Math.floor(Math.random() * 30 + 40);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    rippleContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 700);
  }

  function createClickStars(x, y) {
    if (!rippleContainer) return;
    const starCount = 3;
    const stars = ['✨', '⭐', '🌸', '🫧'];
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'click-star';
      star.textContent = stars[Math.floor(Math.random() * stars.length)];
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 45 + 25;
      star.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      star.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);

      rippleContainer.appendChild(star);
      setTimeout(() => star.remove(), 800);
    }
  }

  // Squishy sound triggers on hover
  const squishyElements = document.querySelectorAll('.squishy-bubble, .key-badge, .cv-fact-card, .milestone-card, .exp-class-card, .format-card, .skill-bubble-card');
  squishyElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (typeof KawaiiAudio !== 'undefined') {
        KawaiiAudio.playBubblePop();
      }
    });
  });

  // ==========================================
  // 3. ANIMAL COMPANION INTERACTIONS
  // ==========================================
  const bunnyMessages = [
    'Cùng học Toán nhé! 🌸',
    'Chị Ngọc dạy rất hay! ⭐',
    'Liên hệ ngay đi nào! 📞',
    'Toán học thật thú vị! ✨',
    'Cố lên! Bạn làm được! 💪',
    'Mình tin bạn sẽ đỗ! 🌟',
  ];
  let bunnyMsgIdx = 0;

  if (heroBunny && bunnySpeech) {
    heroBunny.addEventListener('click', () => {
      bunnyMsgIdx = (bunnyMsgIdx + 1) % bunnyMessages.length;
      bunnySpeech.textContent = bunnyMessages[bunnyMsgIdx];
      bunnySpeech.style.animation = 'none';
      bunnySpeech.offsetHeight; // reflow
      bunnySpeech.style.animation = 'speechPop 0.4s ease-out';
      if (typeof KawaiiAudio !== 'undefined') {
        KawaiiAudio.playFairyChime();
      }
    });
  }

  if (cheeringCat) {
    cheeringCat.addEventListener('click', () => {
      createClickStars(
        cheeringCat.getBoundingClientRect().left + cheeringCat.offsetWidth / 2,
        cheeringCat.getBoundingClientRect().top + 30
      );
      if (typeof KawaiiAudio !== 'undefined') {
        KawaiiAudio.playFairyChime();
      }
    });
  }

  // ==========================================
  // 4. NAVIGATION SCROLL & ACTIVE TRACKING
  // ==========================================
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header shadow on scroll
    if (scrollPos > 60) {
      header.style.top = '0.5rem';
    } else {
      header.style.top = '1.25rem';
    }

    // Back to top button visibility
    if (scrollPos > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Active Section Tracking
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Smooth Back to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 5. SOUND TOGGLE BUTTON
  // ==========================================
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (typeof KawaiiAudio !== 'undefined') {
        const isMuted = KawaiiAudio.toggleMute();
        soundToggleBtn.textContent = isMuted ? '🔇' : '🔔';
        showToast(isMuted ? 'Đã tắt âm thanh hiệu ứng 🔇' : 'Đã bật âm thanh hiệu ứng 🔔✨');
      }
    });
  }

  // ==========================================
  // 6. SCROLL REVEAL OBSERVER
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 7. CV LIGHTBOX MODAL
  // ==========================================
  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cvModal) {
        cvModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof KawaiiAudio !== 'undefined') {
          KawaiiAudio.playFairyChime();
        }
      }
    });
  });

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeCvBtn) {
    closeCvBtn.addEventListener('click', closeCvModal);
  }

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        closeCvModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
      closeCvModal();
    }
  });

  // ==========================================
  // 8. TOAST NOTIFICATION & COPY BUTTONS
  // ==========================================
  let toastTimer = null;
  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Copy Email Button
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'phamngoc280627@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✨ Đã sao chép email: phamngoc280627@gmail.com');
        if (typeof KawaiiAudio !== 'undefined') {
          KawaiiAudio.playFairyChime();
        }
      });
    });
  });

  // Copy Phone Button
  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');
  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const phone = '0818132028';
      navigator.clipboard.writeText(phone).then(() => {
        showToast('📞 Đã sao chép số điện thoại: 0818132028');
        if (typeof KawaiiAudio !== 'undefined') {
          KawaiiAudio.playFairyChime();
        }
      });
    });
  });

  // ==========================================
  // 9. CONSULTATION CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('consultation-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const grade = document.getElementById('form-grade')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Đang gửi thư... 💌</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
        contactForm.reset();
        showToast(`💌 Cảm ơn bạn ${name}! Chị Ngọc đã nhận được lời nhắn và sẽ liên hệ sớm! ✨`);
        if (typeof KawaiiAudio !== 'undefined') {
          KawaiiAudio.playSuccessJingle();
        }
      }, 1200);
    });
  }
});
