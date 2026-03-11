export async function getRepos() {
  const res = await fetch('https://api.github.com/users/cassiossousa/repos');

  return res.json();
}
