import dotenv from 'dotenv';

dotenv.config();

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
  process.exit(1);
});

const [, , command] = process.argv;

main(command);

async function main(command) {
  const { run } = await import(`./commands/${command}.js`);
  try {
    await run();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
