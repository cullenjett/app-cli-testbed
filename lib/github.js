import OctokitREST from '@octokit/rest';

const github = new OctokitREST.Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export const fetchSampleRepo = async () => {
  return github.paginate(github.issues.listForRepo, {
    owner: 'octokit',
    repo: 'rest.js',
  });
};
