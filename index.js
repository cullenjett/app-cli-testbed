import dotenv from 'dotenv';

dotenv.config();

const [, , command] = process.argv;

main(command);

async function main(command) {
  const { run } = await import(`./commands/${command}.js`);
  await run();
}
