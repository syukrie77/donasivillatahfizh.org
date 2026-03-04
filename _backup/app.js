/* ===========================================
   DONASI VILLA TAHFIZH — JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════ HEADER SCROLL EFFECT ═══════════
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ═══════════ HAMBURGER MENU ═══════════
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const toggleMobileNav = () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobileNav);
  mobileOverlay.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileNav();
      }
    });
  });

  // ═══════════ SMOOTH SCROLL ═══════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ═══════════ SCROLL REVEAL ═══════════
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═══════════ PROGRESS BAR ANIMATION ═══════════
  const progressBar = document.getElementById('progressBar');
  const progressAmount = document.getElementById('progressAmount');
  const progressPercent = document.getElementById('progressPercent');
  const targetAmount = 13000000000; // 13 Billion
  const currentPercent = 62;
  const currentAmount = targetAmount * (currentPercent / 100);

  let progressAnimated = false;

  const animateProgress = () => {
    if (progressAnimated) return;
    progressAnimated = true;

    // Animate bar width
    progressBar.style.width = currentPercent + '%';

    // Animate amount counter
    animateCounter(progressAmount, 0, currentAmount, 2000, (val) => {
      return 'Rp ' + formatNumber(Math.round(val));
    });

    // Animate percentage
    animateCounter(progressPercent, 0, currentPercent, 2000, (val) => {
      return Math.round(val) + '%';
    });
  };

  const progressSection = document.querySelector('.progress-section');
  if (progressSection) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateProgress, 300);
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    progressObserver.observe(progressSection);
  }

  // ═══════════ SIMULASI PAHALA ═══════════
  const nominalInput = document.getElementById('nominalWakaf');
  const simulasiResult = document.getElementById('simulasiResult');
  const resultArea = document.getElementById('resultArea');
  const resultPercent = document.getElementById('resultPercent');
  const resultMessage = document.getElementById('resultMessage');

  // Price per m² = 13B / 1300 = 10,000,000 per m²
  const pricePerSqm = 10000000;
  const totalArea = 1300;

  const calculateSimulasi = (nominal) => {
    if (nominal <= 0 || isNaN(nominal)) {
      simulasiResult.classList.remove('show');
      return;
    }

    const area = nominal / pricePerSqm;
    const percent = (area / totalArea) * 100;

    simulasiResult.classList.add('show');
    resultArea.textContent = area >= 1 ? area.toFixed(1) + ' m²' : (area * 10000).toFixed(1) + ' cm²';
    resultPercent.textContent = percent.toFixed(4) + '% dari total lahan';

    // Motivational messages
    if (nominal >= 50000000) {
      resultMessage.textContent = '🌟 MasyaAllah! Kontribusi yang sangat besar untuk rumah para penghafal Al-Qur\'an!';
    } else if (nominal >= 10000000) {
      resultMessage.textContent = '💎 Luar biasa! Anda menjadi bagian penting dari pembangunan Villa Tahfizh!';
    } else if (nominal >= 1000000) {
      resultMessage.textContent = '🤲 JazakAllahu Khairan! Setiap rupiah Anda sangat berarti.';
    } else {
      resultMessage.textContent = '❤️ Berapa pun nilai wakaf Anda, sangat berarti bagi para penghafal Al-Qur\'an.';
    }
  };

  if (nominalInput) {
    nominalInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^\d]/g, '');
      if (value) {
        e.target.value = formatNumber(parseInt(value));
        calculateSimulasi(parseInt(value));
      } else {
        e.target.value = '';
        simulasiResult.classList.remove('show');
      }
    });
  }

  // ═══════════ FAQ ACCORDION ═══════════
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ═══════════ TESTIMONI SLIDER ═══════════
  const testimoniTrack = document.getElementById('testimoniTrack');
  const dotsContainer = document.getElementById('testimoniDots');
  const prevBtn = document.getElementById('prevTestimoni');
  const nextBtn = document.getElementById('nextTestimoni');

  if (testimoniTrack) {
    let currentSlide = 0;
    let slidesPerView = getSlidesPerView();
    const cards = testimoniTrack.querySelectorAll('.testimoni-card');
    const totalSlides = cards.length;
    let maxSlide = Math.max(0, totalSlides - slidesPerView);

    function getSlidesPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('span');
        dot.className = 'testimoni-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const slideWidth = 100 / slidesPerView;
      testimoniTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      document.querySelectorAll('.testimoni-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(index, maxSlide));
      updateSlider();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-play
    let autoplayInterval = setInterval(() => {
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      updateSlider();
    }, 5000);

    // Pause on hover
    testimoniTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    testimoniTrack.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(() => {
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateSlider();
      }, 5000);
    });

    // Resize handler
    window.addEventListener('resize', () => {
      slidesPerView = getSlidesPerView();
      maxSlide = Math.max(0, totalSlides - slidesPerView);
      currentSlide = Math.min(currentSlide, maxSlide);
      createDots();
      updateSlider();
    });

    createDots();
    updateSlider();
  }

  // ═══════════ COUNTDOWN TIMER ═══════════
  // Set target date 180 days from now
  const countdownTarget = new Date();
  countdownTarget.setDate(countdownTarget.getDate() + 180);

  function updateCountdown() {
    const now = new Date();
    const diff = countdownTarget - now;

    if (diff <= 0) {
      document.getElementById('countDays').textContent = '00';
      document.getElementById('countHours').textContent = '00';
      document.getElementById('countMinutes').textContent = '00';
      document.getElementById('countSeconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

}); // end DOMContentLoaded

// ═══════════ UTILITY FUNCTIONS ═══════════
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function animateCounter(element, start, end, duration, formatter) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;

    element.textContent = formatter(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Global function for preset buttons
function setNominal(amount) {
  const input = document.getElementById('nominalWakaf');
  if (input) {
    input.value = formatNumber(amount);
    input.dispatchEvent(new Event('input'));
  }
}
