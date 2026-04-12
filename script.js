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
const analyticsDiv = document.getElementById("analytics");

let allRepos = [];
let filteredRepos = [];

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.innerText = "🌞";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getUserData(input.value.trim());
});

async function getUserData(username) {
  loading.style.display = "block";

  const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

  const user = await (await fetch(`https://api.github.com/users/${username}`, { headers })).json();
  if (user.message) {
    profile.innerHTML = `<h2>${user.message}</h2>`;
    loading.style.display = "none";
    return;
  }

  const repoData = await (await fetch(`https://api.github.com/users/${username}/repos`, { headers })).json();

  allRepos = repoData;
  filteredRepos = repoData;

  renderProfile(user);
  renderStats(user, repoData);
  renderRepos(repoData);
  renderAnalytics(repoData);

  loading.style.display = "none";
}

function renderProfile(user) {
  profile.innerHTML = `
    <h2>${user.name || ""}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || ""}</p>
  `;
}

function renderStats(user, repos) {
  const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  stats.innerHTML = `
    <div>👥 ${user.followers}</div>
    <div>📦 ${user.public_repos}</div>
    <div>⭐ ${stars}</div>
  `;
}

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

filterSelect.onchange = () => {
  filteredRepos = filterSelect.value === "high"
    ? allRepos.filter(r => r.stargazers_count > 10)
    : filterSelect.value === "low"
    ? allRepos.filter(r => r.stargazers_count <= 10)
    : allRepos;

  renderRepos(filteredRepos);
};

sortSelect.onchange = () => {
  let sorted = [...filteredRepos];
  if (sortSelect.value === "stars") sorted.sort((a,b)=>b.stargazers_count-a.stargazers_count);
  if (sortSelect.value === "forks") sorted.sort((a,b)=>b.forks_count-a.forks_count);
  renderRepos(sorted);
};

function addFav(name) {
  let favs = JSON.parse(localStorage.getItem("favRepos")) || [];
  favs = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
  localStorage.setItem("favRepos", JSON.stringify(favs));
}

function renderAnalytics(repos) {
  let map = {};
  repos.forEach(r => {
    if (r.language) map[r.language] = (map[r.language] || 0) + 1;
  });

  let top = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5);

  analyticsDiv.innerHTML = `
    <h3>🧠 Top Languages</h3>
    ${top.map(([l,c])=>`<p>${l}: ${c}</p>`).join("")}
  `;
}