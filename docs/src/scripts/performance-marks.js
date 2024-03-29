window.addEventListener('load', () => {
  document.querySelector('[data-stats="render"]').textContent = Math.round(
    performance.timing.domComplete - performance.timing.domLoading
  );
});
const performanceObserver = new PerformanceObserver((entries) => {
  const renderStart = entries.getEntriesByName('prpl-render-start');
  const renderEnd = entries.getEntriesByName('prpl-render-end');
  if (renderStart.length && renderEnd.length) {
    document.querySelector('[data-stats="render"]').textContent = Math.round(
      renderEnd[0].startTime - renderStart[0].startTime
    );
    performance.clearMarks();
  }
});
performanceObserver.observe({ entryTypes: ['mark'] });
