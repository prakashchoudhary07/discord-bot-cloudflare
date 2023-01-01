import { HELLO_COMMAND, VERIFY_COMMAND, TASK_COMMAND } from "./commands.js";
import { registerResponseType } from "./types.js";
import { config } from "dotenv";

config();
async function registerGuildCommands(
  token?: string,
  applicationId?: string,
  testGuildId?: string
) {
  if (!token) {
    throw new Error("The DISCORD_TOKEN environment variable is required.");
  }
  if (!applicationId) {
    throw new Error(
      "The DISCORD_APPLICATION_ID environment variable is required."
    );
  }
  if (!testGuildId) {
    throw new Error(
      "The DISCORD_TEST_GUILD_ID environment variable is required."
    );
  }
  const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands`;
  const res = await registerCommands(url, token);
  const json: Array<registerResponseType> =
    (await res.json()) as Array<registerResponseType>;
  json.forEach(async (cmd: registerResponseType) => {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands/${cmd.id}`
    );
    if (!response.ok) {
      console.error(`Problem removing command ${cmd.id}`);
    }
  });
  return "registered all commands";
}

async function registerCommands(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify([HELLO_COMMAND, VERIFY_COMMAND, TASK_COMMAND]),
  });

  if (response.ok) {
    console.log("Registered all commands");
  } else {
    console.error("Error Registering Commands");
    const text = await response.text();
    console.error(text);
  }
  return response;
}

console.log(process.env);

registerGuildCommands(
  process.env.DISCORD_TOKEN,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TEST_GUILD_ID
);
