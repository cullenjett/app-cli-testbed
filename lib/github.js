import githubGraphql from '@octokit/graphql';

const { graphql } = githubGraphql;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});

export const fetchSampleRepo = async () => {
  const { repository } = await graphqlWithAuth(`
    {
      repository(owner: "octokit", name: "graphql.js") {
        issues(last: 3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `);

  return repository;
};
