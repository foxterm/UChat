import type { CloudFunctionContext } from "@edgeone/types";

export function onRequest({ request }: CloudFunctionContext) {
  // @ts-ignore
  const eo = request?.eo;
  const origin = request?.headers.get("origin") || "";

  // 允许 foxterm 全站与 uchat.cn 及其子域读取地理位置
  const allowedOriginRegex =
    /^https:\/\/([a-z0-9-]+\.)*(foxterm\.app|foxterm\.cn|uchat\.cn)$/i;

  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=UTF-8",
  };

  if (allowedOriginRegex.test(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return new Response(JSON.stringify(eo), {
    headers,
  });
}
