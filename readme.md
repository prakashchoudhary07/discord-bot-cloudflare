## Steps used up to set up this project.

- Create a blank github repository
- Add the following secrets to github repository secrets:
  - DISCORD_TOKEN
  - DISCORD_APPLICATION_ID
  - DISCORD_TEST_GUILD_ID
  - DISCORD_PUBLIC_KEY
  - FIRESTORE_PRIVATE_KEY
  - FIRESTORE_SERVICE_ACCOUNT
  - CLOUDFLARE_API_TOKEN
- Initiate node with `npm init` in a blank folder
- Install wrangler cli globally by using `npm i -g wrangler` command
- initiate wrangler in the project by using `wrangler init -y` command
  - This command initiates a git repository, sets your ptoject to typescript, installs wrangler to your package.json
- now install the packages using the command: `npm i discord-interactions itty-router`
- now install dev dependency packages using : `npm i -D eslint ngrok eslint prettier pre-commit ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser`
