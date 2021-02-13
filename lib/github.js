import OctokitREST from '@octokit/rest';

const github = new OctokitREST.Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export const createPullRequest = () => {
  return github.pulls.create({
    owner: 'cullenjett',
    repo: 'app-cli-testbed',
    head: 'develop',
    base: 'main',
    title: "They're *inside* the computer!",
    body:
      'Selvage franzen hoodie disrupt. Master cleanse photo booth celiac chillwave twee flannel kickstarter, four loko +1 letterpress chartreuse synth polaroid gentrify. Hell of craft beer tilde yr blog. Seitan brooklyn skateboard jean shorts gastropub messenger bag. Godard farm-to-table mumblecore before they sold out, franzen lo-fi unicorn man braid banjo. Disrupt 3 wolf moon poke copper mug. Bitters post-ironic wolf, actually fashion axe shabby chic +1 pitchfork copper mug migas sriracha VHS.',
  });
};
