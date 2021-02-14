import {
  createReleasePullRequest,
  createRelease,
  fetchTags,
  getPullRequests,
  mergePullRequest,
  isPullRequestMerged,
} from '../lib/github.js';

export const run = async () => {
  const existingTags = await fetchTags();
  const tag = generateTag(existingTags);
  console.log({ tag });

  const pullNumber = await createReleasePullRequest({
    title: `[Release] ${tag}`,
    body: 'Lorem ipsum',
  });
  console.log({ pullNumber });

  let isMerged = await isPullRequestMerged(pullNumber);
  console.log({ isMerged });
  while (!isMerged) {
    await wait(2000);
    isMerged = await isPullRequestMerged(pullNumber);
    console.log({ isMerged });
  }

  const release = await createRelease(tag);
  console.log({ release });
};

function generateTag(existingTags) {
  const tag = 'v/' + todayString();

  for (let i = 1; i < 100; i++) {
    const versionedTag = i === 1 ? tag : `${tag}-${i}`;
    const isAlreadyTagged = existingTags.includes(versionedTag);

    if (!isAlreadyTagged) {
      return versionedTag;
    }
  }

  throw new Error('Unable to generate tag');
}

function todayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = padZero(today.getMonth() + 1);
  const day = padZero(today.getDate());

  return `${year}.${month}.${day}`;
}

function padZero(num) {
  if (num < 10) {
    return '0' + num;
  } else {
    return String(num);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
