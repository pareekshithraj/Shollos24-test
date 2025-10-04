// Universal Theme Management Script
// This script should be included in all dashboard pages

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');
  
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  }
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.querySelector('.theme-icon');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) {
      themeIcon.textContent = '☀️';
    }
  } else {
    if (themeIcon) {
      themeIcon.textContent = '🌙';
    }
  }
}

// Mobile navigation functionality
function toggleMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  
  if (mobileNav && hamburger) {
    mobileNav.classList.toggle('active');
    hamburger.classList.toggle('active');
  }
}

// Close mobile nav when clicking outside
function setupMobileNavClose() {
  document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNav');
    const hamburger = document.getElementById('hamburger');
    
    if (mobileNav && hamburger && 
        !mobileNav.contains(event.target) && 
        !hamburger.contains(event.target)) {
      mobileNav.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });

  // Close mobile nav when window is resized to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      const mobileNav = document.getElementById('mobileNav');
      const hamburger = document.getElementById('hamburger');
      if (mobileNav && hamburger) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  setupMobileNavClose();
});

// Export functions for global use
window.toggleTheme = toggleTheme;
window.toggleMobileNav = toggleMobileNav;

