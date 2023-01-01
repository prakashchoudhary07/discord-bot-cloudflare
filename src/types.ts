export interface messageTypes {
    type: number;
    data: messageDataDataTypes;
  }
  
  export interface messageDataDataTypes {
    name: string;
    options: Array<messageDataOptionsTypes>;
  }
  
  export interface messageDataOptionsTypes {
    name: string;
    type: number;
    value: string;
  }
  
  export interface registerResponseType {
    id: string;
    name: string;
    description: string;
    options: messageDataDataTypes;
  }
  
  export interface objectToBase64Types {
    alg?: string;
    typ?: string;
    iss?: string;
    scope?: string;
    aud?: string;
    exp?: number;
    iat?: number;
  }
  
  export interface oauthTypes {
    access_token: string;
  }
  
  export interface ENV {
    DISCORD_APPLICATION_ID: string;
    DISCORD_PUBLIC_KEY: string;
    FIRESTORE_PRIVATE_KEY: string;
    DISCORD_TOKEN: string;
    FIRESTORE_SERVICE_ACCOUNT: string;
  }
  
  export interface resultTypes{
    document:{
      fields: {
        username: {
          stringValue:string
        },
        github_id: {
          stringValue:string
        }
      }
    }
  }
  
  export interface taskTypes{
    title: string;
    endsOn: number;
    status: string;
    assignee: string;
  }
  
  export interface taskResponseTypes{
    statusCode?: number;
    tasks?: Array<taskTypes>;
  }
  