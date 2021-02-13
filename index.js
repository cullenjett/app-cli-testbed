const [, , command] = process.argv;

main(command);

async function main(command) {
  const { run } = await import(`./commands/${command}.js`);
  run();
}
