import getGoogleAuthToken from "./generateToken";

export default async function firestoreOperations(
  method: string,
  project_id: string,
  collection: string,
  key: string,
  user: string,
  searchValue?: string
) {
  const scope = "https://www.googleapis.com/auth/datastore";
  const BASE_URL = "https://firestore.googleapis.com/v1";
  const url = `${BASE_URL}/projects/${project_id}/databases/(default)/documents/:runQuery`;

  const authToken = await getGoogleAuthToken(user, key, scope);

  if(!searchValue){
    searchValue="jhonDoe"
  }

  const body = `
    {
      "structuredQuery":{
      "from":[{
        "collectionId": "${collection}",
        "allDescendants" : false,
      }],
      "where":{
        "fieldFilter":{
          "field":{
            "fieldPath": "username"
          },
          "op":"EQUAL",
          "value":{
            "stringValue": "${searchValue}",
          }
        }
      } 
    }
  }`

  const response = await fetch(url, {
    method: method,
    headers: {
      "x-goog-api-client": "gdcl/6.0.4 gl-node/18.12.1 auth/8.7.0",
      "Accept-Encoding": "gzip",
      "User-Agent": "google-api-nodejs-client/6.0.4 (gzip)",
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
    body: body
  });
  return await response.json();
}
