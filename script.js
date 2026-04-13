// const TOKEN = "";

// // Elements
// const input = document.getElementById("searchInput");
// const profile = document.getElementById("profile");
// const repos = document.getElementById("repos");
// const stats = document.getElementById("stats");
// const loading = document.getElementById("loading");
// const sortSelect = document.getElementById("sort");
// const filterSelect = document.getElementById("filter");
// const themeToggle = document.getElementById("themeToggle");
// const analyticsDiv = document.getElementById("analytics");

// let allRepos = [];
// let filteredRepos = [];

// if (localStorage.getItem("theme") === "light") {
//   document.body.classList.add("light");
//   themeToggle.innerText = "🌞";
// }

// themeToggle.onclick = () => {
//   document.body.classList.toggle("light");
//   localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
// };

// input.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") getUserData(input.value.trim());
// });

// async function getUserData(username) {
//   loading.style.display = "block";

//   const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

//   const user = await (await fetch(`https://api.github.com/users/${username}`, { headers })).json();
//   if (user.message) {
//     profile.innerHTML = `<h2>${user.message}</h2>`;
//     loading.style.display = "none";
//     return;
//   }

//   const repoData = await (await fetch(`https://api.github.com/users/${username}/repos`, { headers })).json();

//   allRepos = repoData;
//   filteredRepos = repoData;

//   renderProfile(user);
//   renderStats(user, repoData);
//   renderRepos(repoData);
//   renderAnalytics(repoData);

//   loading.style.display = "none";
// }

// function renderProfile(user) {
//   profile.innerHTML = `
//     <h2>${user.name || ""}</h2>
//     <p>@${user.login}</p>
//     <p>${user.bio || ""}</p>
//   `;
// }

// function renderStats(user, repos) {
//   const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);
//   stats.innerHTML = `
//     <div>👥 ${user.followers}</div>
//     <div>📦 ${user.public_repos}</div>
//     <div>⭐ ${stars}</div>
//   `;
// }

// function renderRepos(list) {
//   repos.innerHTML = list.map(r => `
//     <div class="repo-card">
//       <h3 title="${r.name}">${r.name}</h3>
//       <p>⭐ ${r.stargazers_count}</p>
//       <p>🍴 ${r.forks_count}</p>
//       <button onclick="addFav('${r.name}')">❤️</button>
//     </div>
//   `).join("");
// }

// filterSelect.onchange = () => {
//   filteredRepos = filterSelect.value === "high"
//     ? allRepos.filter(r => r.stargazers_count > 10)
//     : filterSelect.value === "low"
//     ? allRepos.filter(r => r.stargazers_count <= 10)
//     : allRepos;

//   renderRepos(filteredRepos);
// };

// sortSelect.onchange = () => {
//   let sorted = [...filteredRepos];
//   if (sortSelect.value === "stars") sorted.sort((a,b)=>b.stargazers_count-a.stargazers_count);
//   if (sortSelect.value === "forks") sorted.sort((a,b)=>b.forks_count-a.forks_count);
//   renderRepos(sorted);
// };

// function addFav(name) {
//   let favs = JSON.parse(localStorage.getItem("favRepos")) || [];
//   favs = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
//   localStorage.setItem("favRepos", JSON.stringify(favs));
// }

// function renderAnalytics(repos) {
//   let map = {};
//   repos.forEach(r => {
//     if (r.language) map[r.language] = (map[r.language] || 0) + 1;
//   });

//   let top = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5);

//   analyticsDiv.innerHTML = `
//     <h3>🧠 Top Languages</h3>
//     ${top.map(([l,c])=>`<p>${l}: ${c}</p>`).join("")}
//   `;
// }








// ─────────────────────────────────────────
//  DEVinsight — script.js
// ─────────────────────────────────────────

// ── STATE ──
let currentTab = 'repos';
let allRepos = [];
let allUsers = [];
let debounceTimer = null;

// ── MOCK DATA ──
const MOCK_REPOS = [
  { full_name: 'facebook/react', description: 'The library for web and native user interfaces.', owner: { login: 'facebook', avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4', type: 'Organization' }, html_url: 'https://github.com/facebook/react', language: 'JavaScript', stargazers_count: 224000, forks_count: 45800, updated_at: '2024-03-10T10:00:00Z', topics: ['react', 'javascript', 'ui'], license: { spdx_id: 'MIT' } },
  { full_name: 'vuejs/vue', description: 'This is the repo for Vue 2. For Vue 3, go to https://github.com/vuejs/core', owner: { login: 'vuejs', avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4', type: 'Organization' }, html_url: 'https://github.com/vuejs/vue', language: 'TypeScript', stargazers_count: 207000, forks_count: 33600, updated_at: '2024-02-20T08:00:00Z', topics: ['vue', 'frontend', 'framework'], license: { spdx_id: 'MIT' } },
  { full_name: 'torvalds/linux', description: 'Linux kernel source tree', owner: { login: 'torvalds', avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4', type: 'User' }, html_url: 'https://github.com/torvalds/linux', language: 'C', stargazers_count: 171000, forks_count: 51000, updated_at: '2024-03-12T12:00:00Z', topics: ['linux', 'kernel', 'os'], license: { spdx_id: 'GPL-2.0' } },
  { full_name: 'microsoft/vscode', description: 'Visual Studio Code — open source code editor made by Microsoft.', owner: { login: 'microsoft', avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4', type: 'Organization' }, html_url: 'https://github.com/microsoft/vscode', language: 'TypeScript', stargazers_count: 158000, forks_count: 27900, updated_at: '2024-03-11T09:00:00Z', topics: ['editor', 'typescript', 'vscode'], license: { spdx_id: 'MIT' } },
  { full_name: 'tensorflow/tensorflow', description: 'An Open Source Machine Learning Framework for Everyone', owner: { login: 'tensorflow', avatar_url: 'https://avatars.githubusercontent.com/u/15658638?v=4', type: 'Organization' }, html_url: 'https://github.com/tensorflow/tensorflow', language: 'Python', stargazers_count: 182000, forks_count: 73900, updated_at: '2024-03-09T07:00:00Z', topics: ['ml', 'python', 'deep-learning'], license: { spdx_id: 'Apache-2.0' } },
  { full_name: 'golang/go', description: 'The Go programming language', owner: { login: 'golang', avatar_url: 'https://avatars.githubusercontent.com/u/4314092?v=4', type: 'Organization' }, html_url: 'https://github.com/golang/go', language: 'Go', stargazers_count: 120000, forks_count: 17200, updated_at: '2024-03-08T06:00:00Z', topics: ['go', 'golang', 'language'], license: { spdx_id: 'BSD-3-Clause' } },
  { full_name: 'rust-lang/rust', description: 'Empowering everyone to build reliable and efficient software.', owner: { login: 'rust-lang', avatar_url: 'https://avatars.githubusercontent.com/u/5430905?v=4', type: 'Organization' }, html_url: 'https://github.com/rust-lang/rust', language: 'Rust', stargazers_count: 93000, forks_count: 12100, updated_at: '2024-03-07T05:00:00Z', topics: ['rust', 'systems', 'language'], license: { spdx_id: 'MIT' } },
  { full_name: 'django/django', description: 'The Web framework for perfectionists with deadlines.', owner: { login: 'django', avatar_url: 'https://avatars.githubusercontent.com/u/27804?v=4', type: 'Organization' }, html_url: 'https://github.com/django/django', language: 'Python', stargazers_count: 77000, forks_count: 30800, updated_at: '2024-03-06T04:00:00Z', topics: ['django', 'python', 'web'], license: { spdx_id: 'BSD-3-Clause' } },
  { full_name: 'vercel/next.js', description: 'The React Framework for the Web', owner: { login: 'vercel', avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4', type: 'Organization' }, html_url: 'https://github.com/vercel/next.js', language: 'JavaScript', stargazers_count: 119000, forks_count: 25400, updated_at: '2024-03-10T11:00:00Z', topics: ['nextjs', 'react', 'ssr'], license: { spdx_id: 'MIT' } },
  { full_name: 'expressjs/express', description: 'Fast, unopinionated, minimalist web framework for node.', owner: { login: 'expressjs', avatar_url: 'https://avatars.githubusercontent.com/u/5658226?v=4', type: 'Organization' }, html_url: 'https://github.com/expressjs/express', language: 'JavaScript', stargazers_count: 63000, forks_count: 13400, updated_at: '2024-02-28T03:00:00Z', topics: ['node', 'express', 'backend'], license: { spdx_id: 'MIT' } },
  { full_name: 'denoland/deno', description: 'A modern runtime for JavaScript and TypeScript.', owner: { login: 'denoland', avatar_url: 'https://avatars.githubusercontent.com/u/42048915?v=4', type: 'Organization' }, html_url: 'https://github.com/denoland/deno', language: 'Rust', stargazers_count: 92000, forks_count: 5100, updated_at: '2024-03-05T02:00:00Z', topics: ['deno', 'javascript', 'typescript'], license: { spdx_id: 'MIT' } },
  { full_name: 'sveltejs/svelte', description: 'Cybernetically enhanced web apps', owner: { login: 'sveltejs', avatar_url: 'https://avatars.githubusercontent.com/u/23617963?v=4', type: 'Organization' }, html_url: 'https://github.com/sveltejs/svelte', language: 'JavaScript', stargazers_count: 76000, forks_count: 3900, updated_at: '2024-03-04T01:00:00Z', topics: ['svelte', 'ui', 'compiler'], license: { spdx_id: 'MIT' } },
];

const MOCK_USERS = [
  { login: 'torvalds',    avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4', html_url: 'https://github.com/torvalds',    type: 'User', score: 131.5 },
  { login: 'gaearon',     avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',  html_url: 'https://github.com/gaearon',     type: 'User', score: 120.3 },
  { login: 'sindresorhus',avatar_url: 'https://avatars.githubusercontent.com/u/170270?v=4', html_url: 'https://github.com/sindresorhus',type: 'User', score: 115.2 },
  { login: 'yyx990803',   avatar_url: 'https://avatars.githubusercontent.com/u/499550?v=4',  html_url: 'https://github.com/yyx990803',  type: 'User', score: 110.9 },
  { login: 'tj',          avatar_url: 'https://avatars.githubusercontent.com/u/25254?v=4',   html_url: 'https://github.com/tj',          type: 'User', score: 105.7 },
  { login: 'addyosmani',  avatar_url: 'https://avatars.githubusercontent.com/u/110953?v=4',  html_url: 'https://github.com/addyosmani', type: 'User', score: 98.4  },
];

// ── THEME ──
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let isDark = true;

const savedTheme = localStorage.getItem('devinsight-theme');
if (savedTheme) {
  isDark = savedTheme === 'dark';
  applyTheme();
}

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
  localStorage.setItem('devinsight-theme', isDark ? 'dark' : 'light');
});

function applyTheme() {
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeToggle.childNodes[1].textContent = isDark ? ' Light Mode' : ' Dark Mode';
}

// ── TABS ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    document.getElementById('repoControls').style.display = currentTab === 'repos' ? 'flex' : 'none';
    const query = document.getElementById('searchInput').value.trim();
    if (query) fetchData(query);
    else clearResults();
  });
});

// ── SEARCH ──
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (q) fetchData(q);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim();
    if (q) fetchData(q);
  }
});

// Debounce — avoids API call on every keystroke
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const q = searchInput.value.trim();
    if (q.length >= 3) fetchData(q);
    else if (!q) clearResults();
  }, 500);
});

// ── FILTER / SORT listeners (client-side HOFs) ──
document.getElementById('langFilter').addEventListener('change', renderRepos);
document.getElementById('sortSelect').addEventListener('change', renderRepos);

// ── FETCH ──
async function fetchData(query) {
  showLoading();
  try {
    if (currentTab === 'repos') {
      const sort = document.getElementById('sortSelect').value;
      const sortParam = sort !== 'best_match' ? `&sort=${sort}` : '';
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}${sortParam}&per_page=60`);
      if (!res.ok) {
        if (res.status === 403 || res.status === 429) throw new Error('rate_limit');
        throw new Error(`GitHub API error: ${res.status}`);
      }
      const data = await res.json();
      allRepos = data.items || [];
      updateStats(data.total_count, allRepos.length);
      renderRepos();
    } else {
      const res = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=30`);
      if (!res.ok) {
        if (res.status === 403 || res.status === 429) throw new Error('rate_limit');
        throw new Error(`GitHub API error: ${res.status}`);
      }
      const data = await res.json();
      allUsers = data.items || [];
      updateStats(data.total_count, allUsers.length);
      renderUsers();
    }
  } catch (err) {
    const isRateLimit = err.message === 'rate_limit' || err.message.includes('Failed to fetch');
    if (isRateLimit) {
      useMockData(query);
    } else {
      showError(err.message);
    }
  }
}

// ── MOCK DATA FALLBACK ──
function useMockData(query) {
  const q = query.toLowerCase();
  showBanner('⚡ GitHub API rate limit reached — showing demo data instead.');

  if (currentTab === 'repos') {
    // Array.filter HOF — search mock repos by query
    allRepos = MOCK_REPOS.filter(r =>
      r.full_name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q)) ||
      r.topics.some(t => t.includes(q))
    );
    if (!allRepos.length) allRepos = MOCK_REPOS; // show all if no match
    updateStats(allRepos.length, allRepos.length);
    renderRepos();
  } else {
    // Array.filter HOF — search mock users by login
    allUsers = MOCK_USERS.filter(u => u.login.toLowerCase().includes(q));
    if (!allUsers.length) allUsers = MOCK_USERS;
    updateStats(allUsers.length, allUsers.length);
    renderUsers();
  }
}

// ── RENDER REPOS (Array HOFs) ──
function renderRepos() {
  const langFilter = document.getElementById('langFilter').value;
  const sort       = document.getElementById('sortSelect').value;

  // Array.filter HOF — language filtering
  let filtered = allRepos.filter(repo => {
    if (!langFilter) return true;
    return repo.language === langFilter;
  });

  // Array.sort HOF — sorting
  filtered = filtered.sort((a, b) => {
    if (sort === 'stars')   return b.stargazers_count - a.stargazers_count;
    if (sort === 'forks')   return b.forks_count - a.forks_count;
    if (sort === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
    return 0; // best_match: preserve API order
  });

  document.getElementById('displayedPill').style.display = '';
  document.getElementById('displayedCount').textContent = filtered.length;

  if (!filtered.length) {
    showEmpty(langFilter ? `No ${langFilter} repos found for this search.` : 'No repositories found.');
    return;
  }

  const grid = document.getElementById('resultsGrid');

  // Array.map HOF — build card HTML
  grid.innerHTML = filtered.map((repo, i) => `
    <div class="card" style="animation-delay:${Math.min(i, 20) * 30}ms">
      <div class="card-top">
        <img class="card-avatar" src="${repo.owner.avatar_url}" alt="${repo.owner.login}" loading="lazy"/>
        <div class="card-title-wrap">
          <a class="card-name" href="${repo.html_url}" target="_blank" rel="noopener">${repo.full_name}</a>
          <div class="card-owner">by ${repo.owner.login} · ${repo.owner.type}</div>
        </div>
      </div>
      <p class="card-desc">${repo.description || 'No description provided.'}</p>
      <div class="card-tags">
        ${repo.language ? `<span class="tag lang">${repo.language}</span>` : ''}
        ${repo.topics ? repo.topics.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('') : ''}
      </div>
      <div class="card-stats">
        <span class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
          </svg>
          ${formatNum(repo.stargazers_count)}
        </span>
        <span class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M7 17V5m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 0v4a4 4 0 0 1-4 4h-2"/>
          </svg>
          ${formatNum(repo.forks_count)}
        </span>
        <span class="stat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          ${timeAgo(repo.updated_at)}
        </span>
        ${repo.license ? `<span class="stat">${repo.license.spdx_id}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// ── RENDER USERS ──
function renderUsers() {
  if (!allUsers.length) { showEmpty('No users found.'); return; }

  const grid = document.getElementById('resultsGrid');

  // Array.map HOF — build user card HTML
  grid.innerHTML = allUsers.map((user, i) => `
    <div class="user-card" style="animation-delay:${Math.min(i, 20) * 30}ms">
      <img class="user-avatar" src="${user.avatar_url}" alt="${user.login}" loading="lazy"/>
      <div class="user-info">
        <a class="user-name" href="${user.html_url}" target="_blank" rel="noopener">${user.login}</a>
        <div class="user-login">${user.type} · Score: ${Math.round(user.score)}</div>
      </div>
    </div>
  `).join('');
}

// ── UI HELPERS ──
function showLoading() {
  document.getElementById('resultsGrid').innerHTML = `
    <div class="state-box">
      <div class="spinner"></div>
      <p>Fetching from GitHub...</p>
    </div>`;
  document.getElementById('statsBar').style.display = 'none';
}

function showEmpty(msg) {
  document.getElementById('resultsGrid').innerHTML = `
    <div class="state-box">
      <div class="icon">🔍</div>
      <p>${msg}</p>
    </div>`;
}

function showBanner(msg) {
  let banner = document.getElementById('apiBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'apiBanner';
    banner.style.cssText = 'background:var(--surface2);border:1px solid var(--yellow);border-radius:10px;padding:0.6rem 1rem;font-size:0.82rem;color:var(--yellow);margin-bottom:1rem;';
    document.getElementById('statsBar').insertAdjacentElement('afterend', banner);
  }
  banner.textContent = msg;
  banner.style.display = 'block';
}

function showError(msg) {
  const b = document.getElementById('apiBanner');
  if (b) b.style.display = 'none';
  document.getElementById('resultsGrid').innerHTML = `
    <div class="state-box">
      <div class="icon">⚠️</div>
      <p>${msg}</p>
    </div>`;
  document.getElementById('statsBar').style.display = 'none';
}

function clearResults() {
  allRepos = [];
  allUsers = [];
  const b = document.getElementById('apiBanner');
  if (b) b.style.display = 'none';
  document.getElementById('resultsGrid').innerHTML = `
    <div class="state-box">
      <div class="icon">🔭</div>
      <p>Search for repositories or users to get started.</p>
    </div>`;
  document.getElementById('statsBar').style.display = 'none';
}

function updateStats(total, shown) {
  document.getElementById('statsBar').style.display = 'flex';
  document.getElementById('totalCount').textContent = formatNum(total);
  document.getElementById('displayedCount').textContent = shown;
}

// ── UTILITY FUNCTIONS ──
function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days < 1)   return 'today';
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}