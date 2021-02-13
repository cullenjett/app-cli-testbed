import { createPullRequest } from '../lib/github.js';

export const run = async () => {
  console.log('Hello from deploy.js');
  const res = await createPullRequest();
  console.log(res);
};
