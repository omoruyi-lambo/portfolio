/* ═══════════════════════════════════════════════════════
   Lambo Code — Work Page Filter
   ═══════════════════════════════════════════════════════ */
(function () {
  const filters = document.querySelectorAll('.wk-filter');
  const cards = document.querySelectorAll('.wk-card');
  const emptyState = document.getElementById('emptyState');

  if (!filters.length || !cards.length) return;

  let currentFilter = 'all';

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.dataset.filter;
      if (filter === currentFilter) return;
      currentFilter = filter;

      // Update active button
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var visibleCount = 0;

      cards.forEach(function (card) {
        var category = card.dataset.category;
        var shouldShow = filter === 'all' || category === filter;

        // Clear any pending timeouts
        clearTimeout(card._hideTimeout);

        if (shouldShow) {
          card.classList.remove('hidden');
          // Force reflow then remove fade-out for smooth transition
          void card.offsetHeight;
          card.classList.remove('fade-out');
          visibleCount++;
        } else {
          // Fade out then hide
          card.classList.add('fade-out');
          card._hideTimeout = setTimeout(function () {
            card.classList.add('hidden');
          }, 350);
        }
      });

      // Show empty state if no cards match
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });
})();
