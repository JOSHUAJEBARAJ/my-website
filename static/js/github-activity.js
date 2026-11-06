(() => {
  const root = document.querySelector('[data-github-activity]');
  if (!root) return;
  const panel = root.querySelector('.activity-panel');
  const status = root.querySelector('.activity-status');
  const chart = root.querySelector('.activity-chart');
  const years = root.querySelector('.activity-years');
  const title = root.querySelector('h2');
  const cache = new Map();
  const today = new Date();
  const currentYear = today.getFullYear();
  let request = 0;
  const dayLength = 86400000;
  const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
  const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

  function render(data, year) {
    const days = [...data.contributions].sort((a, b) => a.date.localeCompare(b.date));
    if (!days.length) throw new Error('No contribution data');
    const start = new Date(`${days[0].date}T00:00:00Z`);
    const end = new Date(`${days[days.length - 1].date}T00:00:00Z`);
    const firstSunday = start.getTime() - start.getUTCDay() * dayLength;
    const weeks = Math.floor((end.getTime() - firstSunday) / (7 * dayLength)) + 1;
    const calendar = document.createElement('div');
    calendar.className = 'activity-calendar';
    calendar.style.setProperty('--weeks', weeks);
    const labels = document.createElement('div');
    labels.className = 'activity-months';
    const grid = document.createElement('div');
    grid.className = 'activity-grid';
    grid.setAttribute('role', 'img');
    const total = days.reduce((sum, day) => sum + day.count, 0);
    const summary = `${total.toLocaleString()} contributions ${year === 'last' ? 'in the last year' : `in ${year}`}`;
    title.textContent = summary;
    grid.setAttribute('aria-label', `${summary}. Daily details are available on GitHub.`);
    let lastMonth = '';
    days.forEach(day => {
      const date = new Date(`${day.date}T00:00:00Z`);
      const week = Math.floor((date.getTime() - firstSunday) / (7 * dayLength));
      const month = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      if (month !== lastMonth) {
        // Avoid overlapping labels for a partial month at either edge.
        if ((week > 1 || day === days[0]) && week < weeks - 1) {
          const label = document.createElement('span');
          label.textContent = monthFormat.format(date);
          label.style.gridColumn = week + 1;
          labels.append(label);
        }
        lastMonth = month;
      }
      const cell = document.createElement('span');
      cell.className = 'activity-day';
      cell.dataset.level = Math.max(0, Math.min(4, day.level));
      cell.style.gridColumn = week + 1;
      cell.style.gridRow = date.getUTCDay() + 1;
      cell.title = `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${dateFormat.format(date)}`;
      grid.append(cell);
    });
    const weekdays = document.createElement('div');
    weekdays.className = 'activity-weekdays';
    weekdays.setAttribute('aria-hidden', 'true');
    ['Mon', 'Wed', 'Fri'].forEach((day, index) => {
      const label = document.createElement('span');
      label.textContent = day;
      label.style.gridRow = index * 2 + 2;
      weekdays.append(label);
    });
    calendar.append(labels, weekdays, grid);
    chart.replaceChildren(calendar);
    chart.hidden = false;
    chart.scrollLeft = chart.scrollWidth;
  }

  async function selectYear(year) {
    const id = ++request;
    panel.setAttribute('aria-busy', 'true');
    status.hidden = false;
    status.textContent = 'Loading contribution activity…';
    chart.hidden = true;
    years.querySelectorAll('button').forEach(button => {
      if (button.dataset.year === String(year)) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    try {
      let data = cache.get(year);
      if (!data) {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(root.dataset.username)}?y=${year}`, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('Contribution request failed');
        data = await response.json();
        if (!Array.isArray(data.contributions) || !data.contributions.length) throw new Error('Invalid contribution data');
        cache.set(year, data);
      }
      if (id !== request) return;
      render(data, year);
      status.hidden = true;
    } catch (_) {
      if (id !== request) return;
      title.textContent = 'GitHub contributions';
      status.textContent = 'Contribution activity is unavailable right now. View the latest activity on GitHub.';
    } finally {
      if (id === request) panel.setAttribute('aria-busy', 'false');
    }
  }

  ['last', ...Array.from({ length: 5 }, (_, index) => currentYear - index)].forEach(year => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = year === 'last' ? 'Last year' : year;
    button.dataset.year = year;
    button.addEventListener('click', () => selectYear(year));
    years.append(button);
  });
  years.hidden = false;
  selectYear('last');
})();
