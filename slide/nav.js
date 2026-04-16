document.getElementById(':$p').addEventListener('click', function (e) {
  if (e.target.closest('button, a, [data-bespoke-marp-osc]')) return;
  const half = window.innerWidth / 2;
  const osc = document.querySelector('[data-bespoke-marp-osc="prev"]');
  if (!osc) return;
  if (e.clientX < half) {
    osc.click();
  } else {
    document.querySelector('[data-bespoke-marp-osc="next"]')?.click();
  }
});
