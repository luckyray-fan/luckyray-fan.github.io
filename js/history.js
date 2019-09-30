var { repo, sha, path, token, last } = {
  repo: 'luckyray-fan/luckyray-fan.github.io',
  sha: 'master',
  path: '/index.html',
  token: null,
  last: 10
};
//
async function getCommits() {
  var response = await fetch(
    `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`
  );
  const json = await response.json();
  console.log(response);
}

getCommits();
