import { addItem } from "./addItem";
import { fetchItem } from "./fetchItem";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return fetchItem(request, env);
    }

    if (url.pathname === "/add" && request.method === "POST") {
      return addItem(request, env);
    }

    return new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  },
} satisfies ExportedHandler<Env>;
