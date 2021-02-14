import OctokitREST from '@octokit/rest';

const github = new OctokitREST.Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export const fetchTags = async () => {
  return github.paginate(github.repos.listTags, withDefaults(), ({ data }) =>
    data.map((tag) => tag.name)
  );
};

export const getPullRequests = async () => {
  const { data } = await github.pulls.list(withDefaults());

  return data;
};

export const createReleasePullRequest = async ({ title, body }) => {
  try {
    const { data } = await github.pulls.create(
      withDefaults({
        head: 'develop',
        base: 'main',
        title,
        body,
      })
    );

    return data.number;
  } catch (err) {
    if (err.status === 422) {
      throw new Error('No commits between main and develop');
    } else {
      throw err;
    }
  }
};

export const isPullRequestMerged = async (pullNumber) => {
  try {
    await github.pulls.checkIfMerged(
      withDefaults({
        pull_number: pullNumber,
      })
    );

    return true;
  } catch (err) {
    if (err.status === 404) {
      return false;
    } else {
      throw err;
    }
  }
};

export const mergePullRequest = async (pullNumber) => {
  const { data } = await github.pulls.merge(
    withDefaults({
      pull_number: pullNumber,
    })
  );

  return data;
};

export const createRelease = async (tag) => {
  const { data } = await github.repos.createRelease(
    withDefaults({
      name: `Release: ${tag}`,
      tag_name: tag,
      target_commitish: 'main',
    })
  );

  return data;
};

function withDefaults(options = {}) {
  return {
    owner: 'cullenjett',
    repo: 'app-cli-testbed',
    ...options,
  };
}
