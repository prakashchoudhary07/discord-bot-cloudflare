import { RequestInfo, RequestInit, Response } from "node-fetch";

export const fetch = async function (
  url: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const { default: fetch } = await import("node-fetch");
  return await fetch(url, init);
};
