// Responsive menu toggle
const toggle = document.getElementById('menu-toggle');
const pages = document.getElementById('pages');
if (toggle && pages) {
  toggle.addEventListener('click', () => {
    pages.classList.toggle('active');
  });
}

// Smooth scroll to featured section
const exploreBtn = document.getElementById('explore-btn');
const featuredSection = document.getElementById('featured-books');
if (exploreBtn && featuredSection) {
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    featuredSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  // ✅ AOS (basic fallback)
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: false, // allow re-trigger when scrolling up
      easing: 'ease-out-cubic'
    });
  }

  // ✅ GSAP advanced animations
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // 🎯 Hero content entrance
    gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".hero-content",
        start: "top 85%",
        toggleActions: "play reverse play reverse"
      }
    });

    // 🎞 Floating hero image with 3D tilt
    gsap.from(".hero-image-wrapper img", {
      y: 100,
      scale: 0.85,
      rotationY: 25,
      rotationX: 10,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".hero-image-wrapper",
        start: "top 85%",
        toggleActions: "play reverse play reverse"
      }
    });

    // 🌀 Parallax background effect
    gsap.to(".hero", {
      backgroundPositionY: "40%",
      scrollTrigger: {
        trigger: ".hero",
        scrub: true,
        start: "top bottom",
        end: "bottom top"
      }
    });

    // 💫 Fade + depth effect for each section
    gsap.utils.toArray("section, .animate-on-scroll, .testimonials, .faq, footer").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 80,
        rotationX: 8,
        scale: 0.98,
        transformOrigin: "center top",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play reverse play reverse", // ✅ fade out when scrolling up
        }
      });
    });

    // 🌟 Floating hero + CTA elements
    gsap.to(".hero-image-wrapper img, .cta button", {
      y: "+=8",
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "sine.inOut"
    });
  }
});

// GSAP circular reveal
if (window.gsap) {
  gsap.fromTo(
    ".reveal-circle",
    { scale: 0, opacity: 1 },
    {
      scale: 8,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      onStart: () => {
        gsap.fromTo(
          ".reveal-text",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
        );
      }
    }
  );
}

// FAQ accordion toggle (safe to append)
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;
    const items = faqSection.querySelectorAll('.faq-item');

    items.forEach(item => {
      const btn = item.querySelector('.faq-question');
      const ans = item.querySelector('.faq-answer');

      // ensure answer initial state
      ans.style.maxHeight = null;
      ans.classList.remove('open');
      ans.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        // close all
        items.forEach(i => {
          const b = i.querySelector('.faq-question');
          const a = i.querySelector('.faq-answer');
          b.setAttribute('aria-expanded', 'false');
          a.setAttribute('aria-hidden', 'true');
          a.classList.remove('open');
          // animate close
          a.style.maxHeight = a.scrollHeight ? a.scrollHeight + 'px' : null; // set to current height to start transition
          // force repaint
          a.offsetHeight;
          a.style.maxHeight = '0px';
        });

        if (!isOpen) {
          // open clicked
          btn.setAttribute('aria-expanded', 'true');
          ans.setAttribute('aria-hidden', 'false');
          ans.classList.add('open');
          // set max-height to scrollHeight for smooth open
          ans.style.maxHeight = ans.scrollHeight + 'px';
          // after transition, clear inline maxHeight to allow internal resizing
          ans.addEventListener('transitionend', function handler(e){
            if (e.propertyName === 'max-height') {
              // only clear when open (keeps it visible and flexible)
              if (ans.classList.contains('open')) {
                ans.style.maxHeight = 'none';
              }
              ans.removeEventListener('transitionend', handler);
            }
          });
        }
      });
    });
  });
})();
