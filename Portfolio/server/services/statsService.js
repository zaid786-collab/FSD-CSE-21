const GITHUB_USERNAME = 'zaid786-collab';

// Authoritative verified CP stats baseline
const cachedCpStats = {
  leetcode: {
    username: 'MOHAMMADZAIDKHAN7',
    profileUrl: 'https://leetcode.com/u/MOHAMMADZAIDKHAN7/',
    solved: 334,
    rating: 1637,
    badges: ['50 Days Badge', '100 Days Badge', '200 Days Badge'],
    ranking: 'Top 18%'
  },
  codechef: {
    username: 'zaid_khan07',
    profileUrl: 'https://www.codechef.com/users/zaid_khan07',
    solved: 619,
    rating: 1420,
    stars: '2★ (Division 3)',
    badges: ['Diamond Badge']
  },
  codeforces: {
    username: 'MohammadZaidKhan',
    profileUrl: 'https://codeforces.com/profile/MohammadZaidKhan',
    contests: 1,
    rating: 'Unrated',
    rank: 'Newbie'
  },
  lastUpdated: new Date().toISOString()
};

let cachedGithubData = {
  user: {
    login: 'zaid786-collab',
    name: 'Mohammad Zaid Khan',
    public_repos: 14,
    followers: 2,
    following: 3,
    avatar_url: 'https://avatars.githubusercontent.com/u/213315430?v=4',
    html_url: 'https://github.com/zaid786-collab'
  },
  repos: [
    {
      name: 'Intervista-AI',
      description: 'Next-Generation AI-Powered Technical Interview & Career Assessment Platform',
      html_url: 'https://github.com/zaid786-collab/Intervista-AI',
      language: 'Python',
      stargazers_count: 5,
      forks_count: 1
    },
    {
      name: 'Smart-Stocks',
      description: 'AI-Powered Investment Intelligence Platform with stock predictions & risk analysis',
      html_url: 'https://github.com/zaid786-collab/Smart-Stocks',
      language: 'JavaScript',
      stargazers_count: 2,
      forks_count: 0
    },
    {
      name: 'Salesforce-Clone',
      description: 'High-fidelity enterprise CRM web portal and lead intake system clone',
      html_url: 'https://github.com/zaid786-collab/Salesforce-Clone',
      language: 'JavaScript',
      stargazers_count: 1,
      forks_count: 0
    },
    {
      name: 'Crime-Lens',
      description: 'Cybernetic crime investigation and threat telemetry analytics platform',
      html_url: 'https://github.com/mayankkotuli099/Crime-Lens',
      language: 'JavaScript',
      stargazers_count: 4,
      forks_count: 1
    }
  ],
  cachedAt: new Date().toISOString()
};

let lastGithubFetch = 0;
const GITHUB_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function getGithubData() {
  const now = Date.now();
  if (now - lastGithubFetch < GITHUB_CACHE_DURATION && cachedGithubData.user) {
    return { ...cachedGithubData, cached: true };
  }

  try {
    const headers = {
      'User-Agent': 'MZK-Portfolio-Server/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`, { headers })
    ]);

    if (userRes.ok && reposRes.ok) {
      const user = await userRes.json();
      const repos = await reposRes.json();

      cachedGithubData = {
        user: {
          login: user.login,
          name: user.name || 'Mohammad Zaid Khan',
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          avatar_url: user.avatar_url,
          html_url: user.html_url
        },
        repos: repos.map(r => ({
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at
        })),
        cachedAt: new Date().toISOString()
      };
      lastGithubFetch = now;
      return { ...cachedGithubData, cached: false };
    }
  } catch (err) {
    console.warn('GitHub API fetch failed, serving verified cached data:', err.message);
  }

  return { ...cachedGithubData, cached: true };
}

export function getCpStats() {
  return { ...cachedCpStats };
}
