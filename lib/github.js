import OctokitREST from '@octokit/rest';
import OctokitThrottle from '@octokit/plugin-throttling';

const throttling = OctokitThrottle.throttling;
const Octokit = OctokitREST.Octokit.plugin(throttling);
const github = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
  throttle: {
    onRateLimit: (_, options) => {
      if (options.request.retryCount <= 2) {
        return true;
      } else {
        return false;
      }
    },
    onAbuseLimit: () => false,
  },
});

export const fetchTags = async () => {
  return github.paginate(github.repos.listTags, withDefaults(), ({ data }) =>
    data.map((tag) => tag.name)
  );
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

    return {
      url: data.html_url,
      pullNumber: data.number,
    };
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

export const createRelease = async (tag) => {
  const { data } = await github.repos.createRelease(
    withDefaults({
      name: `Release: ${tag}`,
      tag_name: tag,
      target_commitish: process.env.GITHUB_RELEASE_BRANCH_NAME,
    })
  );

  return data;
};

function withDefaults(options = {}) {
  return {
    owner: process.env.GITHUB_REPO_OWNER,
    repo: process.env.GITHUB_REPO,
    ...options,
  };
}
