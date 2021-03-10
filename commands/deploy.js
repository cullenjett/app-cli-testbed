import CliSpinner from 'cli-spinner';
import open from 'open';
import promptly from 'promptly';

import {
  createReleasePullRequest,
  createRelease,
  fetchTags,
  isPullRequestMerged,
} from '../lib/github.js';

export const run = async () => {
  let stopLoading = withLoadingMessage('generating tag...');
  const existingTags = await fetchTags();
  const tag = generateTag(existingTags);
  stopLoading();

  const confirmTag = await promptly.confirm(
    `Tag the release with this version? ${tag} (y/n)`
  );

  if (!confirmTag) {
    return;
  }

  stopLoading = withLoadingMessage('creating pull request...');
  const { url, pullNumber } = await createReleasePullRequest({
    title: `[Release] ${tag}`,
    body: 'Lorem ipsum',
  });
  stopLoading();

  stopLoading = withLoadingMessage('waiting for the pull request to close...');
  open(url);
  await waitForMerge(pullNumber);
  stopLoading();

  const release = await createRelease(tag);
  console.log(`Release ${tag} has been cut!`);
  console.log(release);
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
  while (!isMerged) {
    await wait(5000);
    isMerged = await isPullRequestMerged(pullNumber);
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

function withLoadingMessage(msg) {
  const spinner = new CliSpinner.Spinner(msg);
  spinner.setSpinnerString(18);
  spinner.start();
  return () => spinner.stop();
}
