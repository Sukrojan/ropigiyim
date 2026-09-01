document.addEventListener('DOMContentLoaded', function () {
  const logoLink = document.getElementById('logoLink');
  
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function () {
        location.reload();
      }, 300);
    });
  }

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const contactLinks = {
    email: 'mailto:sedat_yldz5834@icloud.com',
    whatsapp: 'https://wa.me/905425331917?text=' + encodeURIComponent('Merhaba, Ropi Giyim hakkında bilgi almak istiyorum.'),
    phone: 'tel:+905425331917'
  };

  document.querySelectorAll('[data-contact]').forEach(function (button) {
    button.addEventListener('click', function () {
      const contactType = button.dataset.contact;
      const contactLink = contactLinks[contactType];

      if (contactLink) {
        window.location.href = contactLink;
      }
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
        });
      });
    }, {
      rootMargin: '-32% 0px -50% 0px',
      threshold: 0.15
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Product Card Image Sliders
  const cardSliders = document.querySelectorAll('.product-card-slider');
  cardSliders.forEach(function (slider) {
    const track = slider.querySelector('.slider-track');
    if (!track) return;
    const slides = track.querySelectorAll('.slider-slide');
    const total = slides.length;
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    const dotsContainer = slider.querySelector('.slider-dots');

    if (total <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsContainer) dotsContainer.style.display = 'none';
      return;
    }

    let currentIndex = 0;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Görsel ' + (i + 1));
        dot.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(i);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach(function (dot, idx) {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function goTo(index) {
      currentIndex = (index + total) % total;
      updateSlider();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(currentIndex + 1);
      });
    }

    // Touch swipe support for mobile
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
      }
    }, { passive: true });
  });

  // ================= Çocuk Ürünleri Kategori & Cinsiyet Filtresi =================
  const catButtons = document.querySelectorAll('[data-filter-cat]');
  const genderButtons = document.querySelectorAll('[data-filter-gender]');
  const kidsProductCards = document.querySelectorAll('#kidsProductGrid .product-card');

  if (catButtons.length && genderButtons.length && kidsProductCards.length) {
    let currentCat = 'alt-ust';
    let currentGender = 'erkek';

    const genderLabels = {
      'alt-ust': {
        erkek: 'Erkek Çocuk (3 Model)',
        kiz: 'Kız Çocuk (4 Model)',
        unisex: null // Alt-Üst'te unisex yok
      },
      'tisort': {
        erkek: 'Erkek Çocuk (3 Model)',
        kiz: 'Kız Çocuk (1 Model)',
        unisex: 'Unisex (1 Model)'
      }
    };

    function updateGenderButtons() {
      const config = genderLabels[currentCat];
      
      // Eğer mevcut seçili cinsiyet bu kategoride yoksa varsayılan olarak 'erkek' yap
      if (!config[currentGender]) {
        currentGender = 'erkek';
      }

      genderButtons.forEach(function (btn) {
        const gender = btn.dataset.filterGender;
        const label = config[gender];

        if (label) {
          btn.style.display = 'inline-flex';
          btn.querySelector('span').textContent = label;
          btn.classList.toggle('active', gender === currentGender);
        } else {
          btn.style.display = 'none';
          btn.classList.remove('active');
        }
      });
    }

    function filterProducts() {
      kidsProductCards.forEach(function (card) {
        const matchCat = card.dataset.cat === currentCat;
        const matchGender = card.dataset.gender === currentGender;

        if (matchCat && matchGender) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentCat = btn.dataset.filterCat;
        catButtons.forEach(b => b.classList.toggle('active', b === btn));
        updateGenderButtons();
        filterProducts();
      });
    });

    genderButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentGender = btn.dataset.filterGender;
        genderButtons.forEach(b => b.classList.toggle('active', b === btn));
        filterProducts();
      });
    });

    // İlk yüklemede filtreyi uygula
    updateGenderButtons();
    filterProducts();
  }
});
