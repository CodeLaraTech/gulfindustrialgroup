/**
 * UI Components — Gulf Industrial Group
 * Preloader · Search Modal · Back to Top
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════
     1. PRELOADER — runs immediately (element is at top of body)
     ═══════════════════════════════════════════════════ */
  const preloader   = document.getElementById('gig-preloader');
  const progressBar = document.querySelector('.preloader-progress-bar');
  const percentEl   = document.querySelector('.preloader-percent');

  if (preloader) {
    const duration  = 1600;
    const startTime = performance.now();

    function animateProgress(now) {
      const elapsed = now - startTime;
      const pct = Math.min(90, Math.round((elapsed / duration) * 90));
      if (progressBar) progressBar.style.width = pct + '%';
      if (percentEl)   percentEl.textContent   = pct + '%';
      if (pct < 90) requestAnimationFrame(animateProgress);
    }
    requestAnimationFrame(animateProgress);

    function hidePreloader() {
      if (progressBar) progressBar.style.width = '100%';
      if (percentEl)   percentEl.textContent   = '100%';
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
      }, 200);
    }

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 300));
    }
    setTimeout(hidePreloader, 4000); // safety fallback
  }


  /* ═══════════════════════════════════════════════════
     2 & 3. SEARCH MODAL + BACK TO TOP
     These elements are at the END of <body>, so we wait
     for DOMContentLoaded before querying the DOM.
     ═══════════════════════════════════════════════════ */
  function initComponents() {

    /* ── Search Modal ─────────────────────────────── */
    const searchModal    = document.getElementById('search-modal');
    const searchInput    = document.getElementById('search-modal-input');
    const searchBackdrop = document.querySelector('.search-backdrop');
    const searchClearBtn = document.querySelector('.search-clear-btn');
    const searchResults  = document.querySelector('.search-results');
    const searchQuick    = document.querySelector('.search-quick-section');
    const searchTriggers = document.querySelectorAll('[data-search-trigger]');

    const siteIndex = [
      { title: 'Home',            desc: 'Gulf Industrial Group – Engineering Excellence Globally', url: 'index.html',           icon: 'home' },
      { title: 'About Us',        desc: 'Over 65 years of industrial leadership and innovation',   url: 'about.html',           icon: 'corporate_fare' },
      { title: 'Businesses',        desc: 'Full spectrum of industrial engineering businesses',         url: 'business/index.html',        icon: 'build' },
      { title: 'Energy Systems',  desc: 'High-performance energy infrastructure solutions',         url: 'service-detail.html',  icon: 'bolt' },
      { title: 'Contact Us',      desc: 'Reach our global teams for technical support',             url: 'contact.html',         icon: 'mail' },
      { title: 'Request a Quote', desc: 'Get a tailored quote from our engineering team',           url: 'request-a-quote.html', icon: 'request_quote' },
    ];

    function openSearch() {
      if (!searchModal) return;
      searchModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput && searchInput.focus(), 100);
    }

    function closeSearch() {
      if (!searchModal) return;
      searchModal.classList.remove('open');
      document.body.style.overflow = '';
      if (searchInput)    searchInput.value = '';
      if (searchClearBtn) searchClearBtn.classList.remove('visible');
      if (searchResults)  searchResults.classList.remove('visible');
      if (searchQuick)    searchQuick.style.display = '';
    }

    function renderResults(query) {
      if (!searchResults) return;
      const q = query.toLowerCase().trim();
      if (!q) {
        searchResults.classList.remove('visible');
        if (searchQuick) searchQuick.style.display = '';
        return;
      }
      if (searchQuick) searchQuick.style.display = 'none';

      const matches = siteIndex.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );

      searchResults.innerHTML = matches.length
        ? matches.map(item => `
            <a class="search-result-item" href="${item.url}">
              <div class="search-result-icon">
                <span class="material-symbols-outlined">${item.icon}</span>
              </div>
              <div class="search-result-text">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
              </div>
            </a>`).join('')
        : `<p style="text-align:center;color:rgba(255,255,255,0.35);padding:24px 0;font-family:'Inter',sans-serif;font-size:14px;">
             No results for "<strong style="color:rgba(255,255,255,0.55)">${query}</strong>"
           </p>`;

      searchResults.classList.add('visible');
    }

    // Search icon trigger buttons
    searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));

    // Backdrop click → close
    if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);

    // Live typing → show results
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const val = searchInput.value;
        if (searchClearBtn) {
          val ? searchClearBtn.classList.add('visible') : searchClearBtn.classList.remove('visible');
        }
        renderResults(val);
      });
    }

    // Clear button
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchClearBtn.classList.remove('visible');
        if (searchResults) searchResults.classList.remove('visible');
        if (searchQuick)   searchQuick.style.display = '';
        if (searchInput)   searchInput.focus();
      });
    }

    // Keyboard: Ctrl/Cmd+K → open | Escape → close
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchModal && searchModal.classList.contains('open') ? closeSearch() : openSearch();
      }
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
        closeSearch();
      }
    });


    /* ── Back to Top ──────────────────────────────── */
    const bttBtn        = document.getElementById('back-to-top');
    const bttProgress   = document.querySelector('.btt-ring-progress');
    const CIRCUMFERENCE = 138; // 2π × r(22)

    function updateBTT() {
      if (!bttBtn) return;
      const scrollTop  = window.scrollY || document.documentElement.scrollTop;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct  = docHeight > 0 ? scrollTop / docHeight : 0;

      if (bttProgress) bttProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - scrollPct);
      bttBtn.classList.toggle('visible', scrollTop > 300);
    }

    if (bttBtn) {
      bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      window.addEventListener('scroll', updateBTT, { passive: true });
      updateBTT(); // initialize on load
    }
  }

  // Defer Search + BTT init until full DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents(); // DOM already available
  }

})();
