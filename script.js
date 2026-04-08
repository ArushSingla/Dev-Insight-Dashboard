// 🔐 Add token (keep empty before submission)
const TOKEN = "";

// Elements
const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const repos = document.getElementById("repos");
const stats = document.getElementById("stats");
const loading = document.getElementById("loading");
const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const themeToggle = document.getElementById("themeToggle");

let allRepos = [];
let filteredRepos = [];

// 🌙 Theme Load
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.innerText = "🌞";
}

// 🌙 Toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    themeToggle.innerText = "🌞";
  } else {
    localStorage.setItem("theme", "dark");
    themeToggle.innerText = "🌙";
  }
};

// 🔍 Search
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getUserData(input.value.trim());
  }
});

// Fetch
async function getUserData(username) {
  loading.style.display = "block";

  const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  const user = await userRes.json();

  if (user.message) {
    profile.innerHTML = `<h2>${user.message} ❌</h2>`;
    loading.style.display = "none";
    return;
  }

  const repoRes = await fetch(`https://api.github.com/users/${username}/repos`, { headers });
  const repoData = await repoRes.json();

  allRepos = repoData;
  filteredRepos = repoData;

  renderProfile(user);
  renderStats(user, repoData);
  renderRepos(repoData);

  loading.style.display = "none";
}

// Profile
function renderProfile(user) {
  profile.innerHTML = `
    <h2>${user.name || ""}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || ""}</p>
  `;
}

// Stats
function renderStats(user, repos) {
  const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);

  stats.innerHTML = `
    <div>👥 ${user.followers}</div>
    <div>📦 ${user.public_repos}</div>
    <div>⭐ ${stars}</div>
  `;
}

// Repos
function renderRepos(list) {
  repos.innerHTML = list.map(r => `
    <div class="repo-card">
      <h3 title="${r.name}">${r.name}</h3>
      <p>⭐ ${r.stargazers_count}</p>
      <p>🍴 ${r.forks_count}</p>
      <button onclick="addFav('${r.name}')">❤️</button>
    </div>
  `).join("");
}

// Filter
filterSelect.onchange = () => {
  if (filterSelect.value === "high") {
    filteredRepos = allRepos.filter(r => r.stargazers_count > 10);
  } else if (filterSelect.value === "low") {
    filteredRepos = allRepos.filter(r => r.stargazers_count <= 10);
  } else {
    filteredRepos = allRepos;
  }
  renderRepos(filteredRepos);
};

// Sort
sortSelect.onchange = () => {
  let sorted = [...filteredRepos];

  if (sortSelect.value === "stars") {
    sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortSelect.value === "forks") {
    sorted.sort((a, b) => b.forks_count - a.forks_count);
  }

  renderRepos(sorted);
};

// Favorites
function addFav(name) {
  let favs = JSON.parse(localStorage.getItem("favRepos")) || [];
  if (!favs.includes(name)) {
    favs.push(name);
    localStorage.setItem("favRepos", JSON.stringify(favs));
  }
}