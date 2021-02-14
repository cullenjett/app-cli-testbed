import open from 'open';

import {
  createReleasePullRequest,
  createRelease,
  fetchTags,
  isPullRequestMerged,
} from '../lib/github.js';

export const run = async () => {
  const existingTags = await fetchTags();
  const tag = generateTag(existingTags);
  console.log({ tag });

  const { url, pullNumber } = await createReleasePullRequest({
    title: `[Release] ${tag}`,
    body: 'Lorem ipsum',
  });
  console.log({ url, pullNumber });
  open(url);

  await waitForMerge(pullNumber);

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

async function waitForMerge(pullNumber) {
  let isMerged = await isPullRequestMerged(pullNumber);
  console.log({ isMerged });
  while (!isMerged) {
    await wait(5000);
    isMerged = await isPullRequestMerged(pullNumber);
    console.log({ isMerged });
  }
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
