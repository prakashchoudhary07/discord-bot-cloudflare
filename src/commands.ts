export const HELLO_COMMAND = {
    name: "hello",
    description: "Replies with hello in the channel",
  };
  
  export const VERIFY_COMMAND = {
    name: "verify",
    description: "Verify the user",
    options: [
      {
        name: "username",
        description: "username of the user to verify",
        type: 3,
        required: false,
      },
    ],
  };
  
  export const TASK_COMMAND = {
    name: 'task',
    description: "Get task details of user",
    options: [
      {
        name: "username",
        description: "RDS username fo fetch RDS tasks",
        type: 3,
        required: true,
      }
    ]
  }
  