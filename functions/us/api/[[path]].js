import { handleRoomApi } from "../../../src/index.js";

export function onRequest(context) {
  return handleRoomApi(context.request, context.env);
}
