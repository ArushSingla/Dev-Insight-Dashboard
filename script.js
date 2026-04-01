const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const repos = document.getElementById("repos");
const loading = document.getElementById("loading");

// Event
searchBtn.addEventListener("click", () => {
  const username = input.value.trim();
  if (!username) return;
  getUserData(username);
});

// Enter key support
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Fetch Data
async function getUserData(username) {
  try {
    loading.style.display = "block";
    profile.innerHTML = "";
    repos.innerHTML = "";

    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userRes.json();

    if (userData.message) {
      profile.innerHTML = `<h2>${userData.message} ❌</h2>`;
      loading.style.display = "none";
      return;
    }

    const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
    const repoData = await repoRes.json();

    renderProfile(userData);
    renderRepos(repoData);

    loading.style.display = "none";

  } catch (err) {
    profile.innerHTML = "<h2>Error fetching data ⚠️</h2>";
    loading.style.display = "none";
  }
}

// Profile UI
function renderProfile(user) {
  profile.innerHTML = `
    <h2>${user.name || "No Name"}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || "No bio available"}</p>
    <hr>
    <p>👥 Followers: ${user.followers}</p>
    <p>➡️ Following: ${user.following}</p>
    <p>📦 Repos: ${user.public_repos}</p>
  `;
}

// Repo UI
function renderRepos(repoList) {
  if (!Array.isArray(repoList) || repoList.length === 0) {
    repos.innerHTML = "<p>No repositories found</p>";
    return;
  }

  repos.innerHTML = repoList.map(repo => `
    <div class="repo-card">
      <h3>${repo.name}</h3>
      <p>⭐ ${repo.stargazers_count}</p>
      <p>🍴 ${repo.forks_count}</p>
      <p>🧠 ${repo.language || "N/A"}</p>
    </div>
  `).join("");
}