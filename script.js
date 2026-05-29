/* ============================================================
   FEIRA DO LIVRO – SÃO JOSÉ DO RIO PRETO
   script.js – Interações e animações
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR: scroll effect + hamburger ── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Fechar menu ao clicar em link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '1';
      });
    });
  });

  /* ── SMOOTH SCROLL para links âncora ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── TABS DE PROGRAMAÇÃO ── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Animar cards ao trocar aba
        panel.querySelectorAll('.prog-card').forEach((card, i) => {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  });

  /* ── CONTADOR ANIMADO ── */
  const counters = [
    { el: document.getElementById('c1'), target: 10,    duration: 1500 },
    { el: document.getElementById('c2'), target: 150,   duration: 2000 },
    { el: document.getElementById('c3'), target: 50,    duration: 1800 },
    { el: document.getElementById('c4'), target: 30000, duration: 2500 },
  ];

  let countersStarted = false;

  function animateCounter(el, target, duration) {
    const start = performance.now();
    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = current >= 1000
        ? current.toLocaleString('pt-BR')
        : current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target >= 1000
        ? target.toLocaleString('pt-BR')
        : target;
    };
    requestAnimationFrame(step);
  }

  /* ── INTERSECTION OBSERVER – fade-in + counter trigger ── */
  const counterSection = document.querySelector('.counter-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Disparar contadores quando a seção aparecer
        if (entry.target === counterSection && !countersStarted) {
          countersStarted = true;
          counters.forEach(c => animateCounter(c.el, c.target, c.duration));
        }
      }
    });
  }, { threshold: 0.15 });

  // Adicionar classe fade-in nos elementos desejados
  const fadeTargets = [
    '.sobre-grid',
    '.prog-card',
    '.turismo-card',
    '.chegar-card',
    '.galeria-item',
    '.counter-section',
    '.newsletter-inner',
  ];

  fadeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  });

  observer.observe(counterSection);

  /* ── LIGHTBOX DA GALERIA ── */
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');

  document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
      const img     = item.querySelector('img');
      const caption = item.querySelector('.galeria-caption');
      if (!img) return;
      lightboxImg.src         = img.src;
      lightboxImg.alt         = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── FORMULÁRIO DE INSCRIÇÃO ── */
  const form        = document.getElementById('newsletterForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando...';
      btn.disabled    = true;

      // Simular envio
      setTimeout(() => {
        form.style.display    = 'none';
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeInUp .5s ease';
      }, 1200);
    });
  }

  /* ── ACTIVE NAV LINK no scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = '#f39c12';
      }
    });
  });

  /* ── PARALLAX SUAVE no hero ── */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      heroContent.style.opacity   = `${1 - window.scrollY / (window.innerHeight * 0.8)}`;
    }
  });

  /* ── KEYFRAME dinâmico para form success ── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);

  /* ── TOOLTIP nos cards de turismo ── */
  document.querySelectorAll('.turismo-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  console.log('%c📖 Feira do Livro – São José do Rio Preto', 'color:#c0392b;font-size:16px;font-weight:bold;');
  console.log('%cLanding Page carregada com sucesso!', 'color:#e67e22;font-size:12px;');
});
