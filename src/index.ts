import { Router } from "itty-router";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { HELLO_COMMAND, TASK_COMMAND, VERIFY_COMMAND } from "./commands";
import {
  ENV,
  messageTypes,
  resultTypes,
  taskResponseTypes,
  taskTypes,
} from "./types";
import firestoreOperations from "./utils/firebase";
// import { registerGuildCommands } from "./register";

class JsonResponse extends Response {
  constructor(body: unknown, init?: ResponseInit) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    super(jsonBody, init);
  }
}

const router = Router();

//Uses itty router

router.get("/", async () => {
  return new Response(`{
    'result': 'Hello World 👋'
  }`);
});

router.post("/", async (request, env: ENV) => {
  const message: messageTypes = await request.json();
  if (message.type === InteractionType.PING) {
    console.log("Handling ping request");
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (message.type === InteractionType.APPLICATION_COMMAND) {
    switch (message.data.name.toLowerCase()) {
      case HELLO_COMMAND.name.toLowerCase(): {
        console.log("Handling Hello Request");
        return new JsonResponse({
          type: 4,
          data: {
            content: `Hello`,
          },
        });
      }
      case VERIFY_COMMAND.name.toLowerCase(): {
        console.log("Handling Verify Request");
        const startTime = Date.now();
        const response = message.data.options[0].value;
        const PROJECT_ID = "rds-backend-f72bf";
        const collection = "users";
        const result: Array<resultTypes> = (await firestoreOperations(
          "POST",
          PROJECT_ID,
          collection,
          env.FIRESTORE_PRIVATE_KEY,
          env.FIRESTORE_SERVICE_ACCOUNT,
          response
        )) as Array<resultTypes>;
        return new JsonResponse({
          type: 4,
          data: {
            content: `Hi ${
              result[0].document.fields.github_id.stringValue
            } verifying ${response} \n startTime = ${new Date(
              startTime
            )}, \n endTime= ${new Date(Date.now())}`,
          },
        });
      }
      case TASK_COMMAND.name.toLowerCase(): {
        console.log("Handling task command");
        let username = "";
        if (message.data.options) username = message.data.options[0]?.value;
        const response = await fetch(
          `https://api.realdevsquad.com/tasks/${username}`
        );
        const data: taskResponseTypes = await response.json();
        let discordReply = "hello";
        if (data.statusCode) {
          discordReply = "Data not Found";
        } else {
          const tasks = data.tasks ? data.tasks : [];
          let reply = `\`\`\`json\n`;
          let i = 0;
          tasks.forEach((task: taskTypes) => {
            i = i + 1;
            reply += `{ \n\ttask number: ${i}, \n\ttitle: ${
              task.title
            }, \n\tends on: ${
              (Date.now() - task.endsOn) / (1000 * 3600 * 24)
            },\n\tstatus: ${task.status},\n\tAssigned to: ${
              task.assignee
            }\n},\n`;
            console.log(new Date(task.endsOn));
          });
          reply += `\`\`\``;
          discordReply = reply;
        }
        return new JsonResponse({
          type: 4,
          data: {
            content: `${discordReply}`,
          },
        });
      }
      default:
        console.error("Unknown Command");
        return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
    }
  }

  console.error("Unknown Type");
  return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
  async fetch(request: Request, env: ENV) {
    if (request.method === "POST") {
      const signature = request.headers.get("x-signature-ed25519");
      const timestamp = request.headers.get("x-signature-timestamp");
      const body = await request.clone().arrayBuffer();

      if (signature === null || timestamp === null) {
        return new Response("Bad Request signature.", { status: 401 });
      }

      const isValidRequest = verifyKey(
        body,
        signature,
        timestamp,
        env.DISCORD_PUBLIC_KEY
      );
      if (!isValidRequest) {
        console.error("Invalid Request");
        return new Response("Bad Request signature.", { status: 401 });
      }
    }

    return router.handle(request, env);
  },
};
